import time
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from sort.sort import Sort
import time
from collections import defaultdict
from module import ViolationDetector
# from module import process_lp_images
import subprocess
import uuid
import threading
from dotenv import load_dotenv
import os
from inference import InferencePipeline
from inference.core.interfaces.camera.entities import VideoFrame
import cv2
import numpy as np
import supervision as sv
from sort.sort import Sort
from datetime import datetime
label_annotator = sv.LabelAnnotator()
box_annotator = sv.BoundingBoxAnnotator()
var = ViolationDetector()

tracker = Sort()

load_dotenv()

parent_dir = os.getenv("PARENT_DIR")
camera_ip = os.getenv("CAM_IP")
camera_id = os.getenv("CAM_ID")
processed_rtsp_url = os.getenv("PROCESSED_RTSP_URL")
cam_rtsp_url = os.getenv("CAM_RSTP")
fps = 30

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# model = YOLO(f"{parent_dir}/models/obj_seg_02.pt")
# model.to(device)
print(f"{device} as Computation Device initiated")
tracker = Sort()

orig_w, orig_h, resized_w, resized_h = (
    1280,
    920,
    int(os.getenv("RESIZED_RESOLUTION_WIDTH")),
    int(os.getenv("RESIZED_RESOLUTION_HEIGHT")),
)
previous_positions = defaultdict(lambda: {"x": 0, "y": 0, "time": 0})
null_mask = np.zeros((resized_h, resized_w), dtype=np.uint8)


track_ids_inframe = {}
custom_track_ids = {}
tracks_left_frame = []
known_track_ids = []

class_list = ['auto','bicycle','bicycle-rider','bus', 'car', 'child','hatchback', 'helmet','license_plate','lorry','man','motorbike','motorbike-rider', 'no_helmet', 'person','scooty','scooty-rider','sedan','suv','tractor','truck','van','vendor','woman']
vehicle_class_list = ['auto','bus', 'car', 'hatchback', 
              'motorbike-rider', 'scooty-rider', 'motorbike','scooty','sedan'
              'suv', 'tractor', 'truck', 'van']
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter("/home/annone/ai/data/output.mp4", fourcc, 30, (1280,960))

def generate_custom_track_id(label, confidence):
    return f"{label}_{confidence}_{uuid.uuid4()}"

def my_custom_sink(predictions: dict, video_frame: VideoFrame):
    detections = predictions["predictions"]
    tracked_frames = []
    current_track_ids = []
    track_detections = []
    image = video_frame.image.copy()
    # image = cv2.resize(image,(1280,960))
    now = datetime.now()
    file_name = now.strftime('%Y-%m-%d %H-%M-%S')
    if now.minute==00:
        cv2.imwrite(f"{parent_dir}/data/municipal/{now}.jpg",image)
    for detection in detections:
        x_center = detection["x"]
        y_center = detection["y"]
        width = detection["width"]
        height = detection["height"]
        confidence = detection["confidence"]
        class_id = detection["class_id"]
        x1 = int(x_center - (width / 2))
        y1 = int(y_center - (height / 2))
        x2 = int(x_center + (width / 2))
        y2 = int(y_center + (height / 2))
        track_detections.append([x1, y1, x2, y2, confidence, class_id])
        # cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 1)

    track_detections = np.array(track_detections)
    tracks = tracker.update(track_detections)

    for track in tracks:
        frame_time = time.time()
        x1, y1, x2, y2, track_id, class_id = map(int, track)
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        bbox = f"{x1}, {y1}, {x2}, {y2}"

        if class_id == 8:
            cropped_plate = image[y1 - 10 : y2 + 10, x1 - 10 : x2 + 10]
            cv2.imwrite(
                        f"{parent_dir}/data/lp/{track_id}_{file_name}.jpg",
                        cropped_plate,
                    )
        if class_id == 10 or class_id == 14 or class_id == 23:
            cropped_plate = image[y1 - 10 : y2 + 10, x1 - 10 : x2 + 10]
            cv2.imwrite(
                        f"{parent_dir}/data/human/{track_id}_{file_name}.jpg",
                        cropped_plate,
                    )
        label = class_list[class_id]

        if label in vehicle_class_list:
                var.check_illegal_parking(track_id, cx, cy, label)
                var.detect_traffic_violation(track_id, cx, cy, label)
                var.detect_wrong_way_violation(track_id, cx, cy, label)

        if track_id not in custom_track_ids:
            custom_id = generate_custom_track_id(label,f"{cx}_{cy}")
            custom_track_ids[track_id] = {
                    "custom_track_id": custom_id,
                    "camera_id": camera_id,
                    "camera_ip": camera_ip,
                    "first_appearance": frame_time,
                    "last_appearance": frame_time,
                    "dbbox": [[x1, y1, x2, y2]],
                    "dlabel": [label],
                    "dconf": [0.5],
                }
        else:
            custom_track_ids[track_id]["dbbox"].append([x1, y1, x2, y2])
            custom_track_ids[track_id]["dlabel"].append(label)
            custom_track_ids[track_id]["dconf"].append(0.5)
            custom_track_ids[track_id]["last_appearance"] = frame_time

        current_track_ids.append(track_id)
        incident_type = None
            
        # red light violation
        if track_id in var.violated_objects:
            incident_type = var.INCIDENT_TYPES["TRAFFIC_VIOLATION"]
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                    image,
                    "red light violation",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 0, 255),
                    2,
                )
            if track_id not in var.logged_traffic:
                var.save_violation_to_db(
                        camera_id, track_id, camera_ip, bbox, incident_type, f"{file_name}.jpeg"
                    )
                var.logged_traffic.add(track_id)
                cv2.imwrite(f"{parent_dir}/data/red_light_violation/{file_name}.jpeg",image)

            # wrong way violation
        if track_id in var.violated_objects_wrong:
            incident_type = var.INCIDENT_TYPES["WRONG_WAY"]
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                    image,
                    "wrong way driving",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 0, 255),
                    2,
                )
            if track_id not in var.logged_wrong:
                var.save_violation_to_db(
                        camera_id, track_id, camera_ip, bbox, incident_type, f"{file_name}.jpeg"
                    )
                var.logged_wrong.add(track_id)
                print(f"{parent_dir}/data/wrong_way_driving/{file_name}.jpeg")
                cv2.imwrite(f"{parent_dir}/data/wrong_way_driving/{file_name}.jpeg", image)
        # illegal parking
        if (
                track_id in var.static_objects
                and var.static_objects[track_id]["violated"]
            ):
            incident_type = var.INCIDENT_TYPES["ILLEGAL_PARKING"]
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                    image,
                    "illegal parking",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 0, 255),
                    2,
                )
            if track_id not in var.logged_parking:
                var.save_violation_to_db(
                        camera_id, track_id, camera_ip, bbox, incident_type, f"{file_name}.jpeg"
                    )
                var.logged_parking.add(track_id)
                cv2.imwrite(f"{parent_dir}/data/illegal_parking/{file_name}.jpeg",image)
        # cv2.putText(image, f"{label} {track_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    var.draw_lines_for_traffic_violation(image)
    out.write(image)
    cv2.imshow("Predictions", image)
    cv2.waitKey(1)
pipeline = InferencePipeline.init(
    model_id="vehicles-pnvsh/1",
    confidence=0.10,
    video_reference=f"{cam_rtsp_url}",
    on_prediction=my_custom_sink,
    api_key="o9xQlct9Wr77cZXqyV17"
)
def cam_stream():
    pipeline.start()
    pipeline.join()
    out.release()

# cam_stream()

import threading

t1 = threading.Thread(target=cam_stream)
t1.start()
t1.join()