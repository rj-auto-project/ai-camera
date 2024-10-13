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
from collections import Counter
import json

load_dotenv()

project_id = "human-classification-gzeln"
model_version = 1
task = "object_detection"
confidence = 0.5
iou_thresh = 0.5
api_key = "gtnlmQZyjHWmJepvn1gy"
img_batch_size = 100
parent_dir = os.getenv("PARENT_DIR")
camera_ip = os.getenv("CAM_IP")
camera_id = os.getenv("CAM_ID")
class_dict = {"normal":"NORMAL","spit":"SPITTING","urinate":"PEEING","garbage-littering":"GARBAGE LITTERING"}
infer_payload = {
    "model_id": f"{project_id}/{model_version}",
    "image": [],
    "confidence": confidence,
    "iou_threshold": iou_thresh,
    "api_key": api_key,
}

def get_file():
    global img_batch_size
    prefix = os.listdir(f"{parent_dir}/data/human")[0].split("_")[0]
    img_list = [i for i in os.listdir(f"{parent_dir}/data/human") if i.startswith(prefix)]
    if len(img_list) < img_batch_size:
        img_batch_size = len(img_list)
    img_list = img_list[:img_batch_size]
    for img in img_list:
        if img.endswith(".jpeg"):
            img_path = os.path.join(f"{parent_dir}/data/human", img)
            image = Image.open(img_path)
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
    print(img_list)
    t1 = time.time()
    res = requests.post(
        f"http://localhost:9001/infer/{task}",
        json=infer_payload,
    )
    pred_resps = res.json()
    print(pred_resps,"-----")
    t2 =  time.time()
    print(t2-t1)
    o = datetime.now()
    label = []
    conf = []
    metaData = {}
    incident = ""
    track_id = 0
    for i,row in enumerate(pred_resps):
        new_track_id,timestamp , _ = img_list[i].split("_")
        print(row)
        track_id = new_track_id
        predicted_class = row["predicted_classes"]
        if o == 0 and predicted_class[0] != "normal":
            o = timestamp
        # incident = class_dict[predicted_class[0]]
        conf.append(row["predictions"][predicted_class[0]]["confidence"])
        label.append(predicted_class[0])
    labels = ['normal', 'normal', 'spit', 'garbage_litering', 'spit', 'normal', 'garbage_litering', 'spit']
    l = [el for el in labels if el != "normal"]
    j = Counter(l)
    k = j.most_common(1)
    if k:
        c, count = k[0]
        incident = class_dict[c]
    else:
        incident = "NORMAL"

    metaData["labels"] = label
    metaData["confs"] = conf
    if incident != "NORMAL":
        conn = Database.get_connection()
        cursor = conn.cursor()
        insert_query = """
            INSERT INTO "IncidentLogs" ("timestamp", "cameraId", "metadata", "trackId", "camera_ip", "incidentType")
            VALUES (%s, %s, %s::json, %s, %s, %s);
            """
        data_to_insert = (o, camera_id, json.dumps(metaData), track_id, camera_ip, incident)
        print(metaData)
        print(data_to_insert)
        cursor.execute(insert_query, data_to_insert)
        conn.commit()
        conn.close()

    # write code to delete the img file after processing