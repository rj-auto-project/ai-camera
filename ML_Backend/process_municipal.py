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
threshold = 10
class_list = ["GARBAGE","POTHOLE","WATERLOGGING"]
infer_payload = {
    "model_id": f"{project_id}/{model_version}",
    "image": [],
    "confidence": confidence,
    "iou_threshold": iou_thresh,
    "api_key": api_key,
}
conn = Database.get_connection()

def get_file():
    global img_batch_size
    img_list = [i for i in os.listdir(f"{parent_dir}/data/municipal")[:50]]
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
    return img_list
a =1
while a == 1 :
    a = 2
    img_list = get_file()
    t1 = time.time()
    res = requests.post(
        f"http://localhost:9001/infer/{task}",
        json=infer_payload,
    )
    pred_resps = res.json()
    t2 =  time.time()
    print(t2-t1)
    o = 0
    incident = ""
    for i,row in enumerate(pred_resps):
        print(row)
        track_id,timestamp , _ = img_list[i].split("_")
        predictions = row["predictions"]
        ttt = datetime.now()
        timestamp = ttt.strftime("%Y-%m-%d %H:%M:%S.%f")
        for prediction in predictions:
            label = class_list[prediction["class_id"]]
            x,y,w,h = prediction["x"],prediction["y"],prediction["width"],prediction["height"]
            x_center = x + (w / 2)
            y_center = y + (h / 2)
            bbox = f"[{x},{y},{w},{h}]"
            cursor = conn.cursor()
            sql_query = """
                WITH pothole_check AS (
                    SELECT id, "alerts"
                    FROM "IncidentLogs"
                    WHERE SQRT(POWER("metaCoords"[1] - %s, 2) + POWER("metaCoords"[2] - %s, 2)) <= %s
                )
                -- Check if a pothole exists
                UPDATE "IncidentLogs"
                SET "alerts" = "alerts" + 1 -- Increment the alerts column
                WHERE id IN (SELECT id FROM pothole_check);

                -- If no existing pothole is found, insert a new record
                INSERT INTO "IncidentLogs" ("timestamp", "cameraId", "trackId", "camera_ip", "boxCoords", "incidentType", "metaCoords", "alerts")
                SELECT %s, %s, %s, %s, %s, %s, ARRAY[%s, %s], 1
                WHERE NOT EXISTS (SELECT 1 FROM pothole_check);
            """

            cursor.execute(sql_query, (x_center, y_center,threshold, timestamp,camera_id,track_id,camera_ip,bbox, label, x_center,y_center))
            conn.commit()

    conn.close()