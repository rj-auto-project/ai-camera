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
from utils import get_frame_dimensions
from module import save_count

label_annotator = sv.LabelAnnotator()
box_annotator = sv.BoundingBoxAnnotator()
var = ViolationDetector()

tracker = Sort()

load_dotenv()

parent_dir = os.getenv("PARENT_DIR")
camera_ip = os.getenv("CAM_IP")
camera_id = os.getenv("CAM_ID")
processed_rtsp_url = os.getenv("PROCESSED_RTSP_URL")
cam_rtsp_url = os.getenv("CAM_RTSP")
fps = 30
print(cam_rtsp_url)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"{device} as Computation Device initiated")
tracker = Sort()

orig_w, orig_h = get_frame_dimensions(cam_rtsp_url)
resized_w, resized_h = (
    int(os.getenv("RESIZED_RESOLUTION_WIDTH")),
    int(os.getenv("RESIZED_RESOLUTION_HEIGHT")),
)

custom_track_ids = {}
class_list = ['auto','bicycle','bicycle-rider','bus', 'car', 'child','hatchback', 'license_plate','helmet','lorry','man','motorbike','motorbike-rider', 'no_helmet', 'person','scooty','scooty-rider','sedan','suv','tractor','truck','van','vendor','woman']
vehicle_class_list = ['auto','bus', 'car', 'hatchback', 
              'motorbike-rider', 'scooty-rider', 'motorbike','scooty','sedan'
              'suv', 'tractor', 'truck', 'van']
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter("C:/project/data/output.mp4", fourcc, 30, (1280,960))

def generate_custom_track_id(label, confidence):
    return f"{label}_{confidence}_{uuid.uuid4()}"

scale_x, scale_y = orig_w / resized_w, orig_h / resized_h

def my_custom_sink(predictions: dict, video_frame: VideoFrame):
    detections = predictions["predictions"]
    current_track_ids = []
    track_detections = []
    image = video_frame.image.copy()
    vehicle_count = 0
    crowd_count = 0
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
        x1, y1, x2, y2 = (
            int(x1 * scale_x),
            int(y1 * scale_y),
            int(x2 * scale_x),
            int(y2 * scale_y),
        )
        track_detections.append([x1, y1, x2, y2, confidence, class_id])

    track_detections = np.array(track_detections)
    tracks = tracker.update(track_detections)

    for track in tracks:
        frame_time = time.time()
        x1, y1, x2, y2, track_id, class_id = map(int, track)
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        # cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        # cv2.circle(image,(cx,cy),1,(0,0,225),2)
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
            crowd_count += 1
        label = class_list[class_id]

        if label in vehicle_class_list:
                var.check_illegal_parking(track_id, cx, cy, label)
                var.detect_traffic_violation(track_id, cx, cy, label)
                var.detect_wrong_way_violation(track_id, cx, cy, label)
                vehicle_count += 1

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
        # if track_id in var.violated_objects:
        if False:
            incident_type = var.INCIDENT_TYPES["TRAFFIC_VIOLATION"]
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                    image,
                    "red light violation",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 0, 255),
                    1,
                )
            if track_id not in var.logged_traffic:
                var.save_violation_to_db(
                        camera_id, track_id, camera_ip, bbox, incident_type, f"{file_name}_{track_id}.jpeg"
                    )
                var.logged_traffic.add(track_id)
                cv2.imwrite(f"{parent_dir}/data/red_light_violation/{file_name}_{track_id}.jpeg",image)

            # wrong way violation
        if track_id in var.violated_objects_wrong:
            incident_type = var.INCIDENT_TYPES["WRONG_WAY"]
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                    image,
                    "wrong way driving",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 0, 255),
                    1,
                )
            if track_id not in var.logged_wrong:
                var.save_violation_to_db(
                        camera_id, track_id, camera_ip, bbox, incident_type, f"{file_name}_{track_id}.jpeg"
                    )
                var.logged_wrong.add(track_id)
                cv2.imwrite(f"{parent_dir}/data/wrong_way_driving/{file_name}_{track_id}.jpeg", image)
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
                    0.5,
                    (0, 0, 255),
                    1,
                )
            if track_id not in var.logged_parking:
                var.save_violation_to_db(
                        camera_id, track_id, camera_ip, bbox, incident_type, f"{file_name}_{track_id}.jpeg"
                    )
                var.logged_parking.add(track_id)
                cv2.imwrite(f"{parent_dir}/data/illegal_parking/{file_name}_{track_id}.jpeg",image)
        # cv2.putText(image, f"{label} {track_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    if now.second % 5 == 0:
        save_count(vehicle_count,crowd_count,now)
    image = cv2.resize(image,(640,480))
    # cv2.putText(image, f"{vehicle_count} {crowd_count}", (10,10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        return
    # var.draw_lines_for_traffic_violation(image)
    out.write(image)
    cv2.imshow("Predictions", image)
    cv2.waitKey(1)
pipeline = InferencePipeline.init(
    model_id="vehicles-pnvsh/2",
    confidence=0.30,
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