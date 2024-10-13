import requests
import base64
from PIL import Image
from io import BytesIO
import os

project_id = "human-classification-gzeln"
model_version = 1
task = "object_detection"
confidence = 0.5
iou_thresh = 0.5
api_key = "gtnlmQZyjHWmJepvn1gy"
img_batch_sie = 50

infer_payload = {
    "model_id": f"{project_id}/{model_version}",
    "image": [],
    "confidence": confidence,
    "iou_threshold": iou_thresh,
    "api_key": api_key,
}

def get_file():
    prefix = os.listdir("/home/annone/ai/data/images/human")[0].split("_")[0]
    img_list = [i for i in os.listdir("/home/annone/ai/data/images/human") if i.startswith(prefix)]
    if len(img_list) > img_batch_sie:
        img_list = img_list[:img_batch_sie]
        print(len(img_list))

get_file()
for j,i in enumerate(os.listdir("/home/annone/ai/data/images/human")):
    if j == 80:
        break
    if i.endswith(".png"):
        img_path = os.path.join("/home/annone/ai/data/images/human", i) 
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

import time
t1 = time.time()
res = requests.post(
    f"http://localhost:9001/infer/{task}",
    json=infer_payload,
)
pred_resps = res.json()
t2 =  time.time()
print(t2-t1)
for row in pred_resps:
    predicted_class = row["predicted_classes"]
    print(predicted_class)