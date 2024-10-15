import requests
import base64
from PIL import Image
from io import BytesIO
import os
import time
from dotenv import load_dotenv
import os
from db import Database
from datetime import datetime
import cv2

load_dotenv()

project_id = "garbage-fivsq"
model_version = 1
task = "object_detection"
confidence = 0.5
iou_thresh = 0.5
api_key = "gtnlmQZyjHWmJepvn1gy"
img_batch_size = 100
parent_dir = os.getenv("PARENT_DIR")
camera_ip = os.getenv("CAM_IP")
camera_id = os.getenv("CAM_ID")
threshold = 20
class_list = ["GARBAGE","POTHOLE","WATERLOGGING"]

conn = Database.get_connection()

def get_file():
    global img_batch_size
    img_list = [i for i in os.listdir(f"{parent_dir}/data/municipal")[:50]]
    infer_payload = {
        "model_id": f"{project_id}/{model_version}",
        "image": [],
        "confidence": confidence,
        "iou_threshold": iou_thresh,
        "api_key": api_key,
    }
    print(img_list)
    for img in img_list:
        img_path = os.path.join(f"{parent_dir}/data/municipal", img)
        image = Image.open(img_path)
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        buffered = BytesIO()
        image.save(buffered, quality=100, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())
        img_str = img_str.decode("ascii")
        obj = {
                    "type": "base64",
                    "value": img_str,
                }
        infer_payload["image"].append(obj)
    return img_list, infer_payload

while True:
    img_list, infer_payload = get_file()
    t1 = time.time()
    res = requests.post(
        f"http://localhost:9001/infer/{task}",
        json=infer_payload,
    )
    pred_resps = res.json()
    # print(len(pred_resps), pred_resps)
    # print(len(img_list))
    t2 =  time.time()
    # print(t2-t1)
    o = 0
    incident = ""
    for i,row in enumerate(pred_resps):
        # print(row["predictions"],i)
        if len(row["predictions"]) > 0:
            timestamp = img_list[i].split(".")[0]
            predictions = row["predictions"]
            # ttt = datetime.now()
            track_id = 0
            thumbnail = img_list[i]
            # timestamp = ttt.strftime("%Y-%m-%d %H:%M:%S.%f")
            for prediction in predictions:
                label = class_list[prediction["class_id"]]
                x,y,w,h = int(prediction["x"]),int(prediction["y"]),int(prediction["width"]),int(prediction["height"])
                x_center = x + (w / 2)
                y_center = y + (h / 2)
                bbox = f"[{x},{y},{w},{h}]"
                img = cv2.imread(f"C:/project/ai-camera/ML_Backend/data/municipal/{thumbnail}")
                print(x_center,y_center)
                cv2.rectangle(img,(x,y),(x+w,y+h),(0,225,0),2)
                cv2.putText(img,label,(x,y),cv2.FONT_HERSHEY_SIMPLEX,0.9,(225,0,0),2)
                img = cv2.resize(img,(640,480))
                cv2.imshow("test",img)
                cv2.waitKey(0)
                cursor = conn.cursor()
                # Define your SQL queries separately
                update_query = """
                    WITH pothole_check AS (
                        SELECT id
                        FROM "IncidentLogs"
                        WHERE SQRT(POWER("metaCoords"[1] - %s, 2) + POWER("metaCoords"[2] - %s, 2)) <= %s
                    )
                    UPDATE "IncidentLogs"
                    SET "alerts" = "alerts" + 1
                    WHERE id IN (SELECT id FROM pothole_check);
                """

                insert_query = """
                    INSERT INTO "IncidentLogs" ("timestamp", "cameraId", "trackId", "camera_ip", "boxCoords", "incidentType", "metaCoords","thumbnail", "alerts")
                    SELECT %s, %s, %s, %s, %s, %s, ARRAY[%s, %s], %s, 1
                    WHERE NOT EXISTS (
                        SELECT 1 FROM "IncidentLogs"
                        WHERE SQRT(POWER("metaCoords"[1] - %s, 2) + POWER("metaCoords"[2] - %s, 2)) <= %s
                    );
                """
                timestamp = " ".join([part.replace("-", ":") if idx == 1 else part for idx, part in enumerate(timestamp.split(" "))]).split(".")[0]
                cursor.execute(update_query, (x_center, y_center, threshold))

                # Execute the insert query
                cursor.execute(insert_query, (timestamp, camera_id, track_id, camera_ip, bbox, label, x_center, y_center,thumbnail, x_center, y_center, threshold))

                # cursor.execute(sql_query, (x_center, y_center,threshold, timestamp,camera_id,track_id,camera_ip,bbox, label, x_center,y_center))
                conn.commit()

    time.sleep(1)
conn.close()