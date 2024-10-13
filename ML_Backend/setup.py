from db import Database
from utils import update_env_var
import os


# fetch camera details
def fetch_camera_data(cam_id :str):
    try:
        conn = Database.get_connection()
        cursor = conn.cursor()
        query = '''SELECT "cameraId", "cameraIp", "location", "cameraName", "rtspLink" FROM "Camera" WHERE "cameraId"= %s'''
        cursor.execute(query,(cam_id))
        rows = cursor.fetchone()
        cursor.close()
        conn.close()
        return rows
    except (Exception) as error:
        print(f"Error fetching data from PostgreSQL table: {error}")

def check_data_dirs(parent_dir):
    folder_names = ["human","lp","municipal","illegal_parking","wrong_way_driving","spiting","urination","garbage_logging","red_light_violation","oversppeding",]
    data_dir = os.path.join(parent_dir,"data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    for folder_name in folder_names:
        try:
            if not os.path.exists(f"{data_dir}/{folder_name}"):
                os.makedirs(f"{data_dir}/{folder_name}")
        except:
            print("permission denies")

# function to setup requirements before starting the ML engine
def init_setup(cam_id):
    check_data_dirs("C:/project/ai-camera/ML_Backend")
    cam_id,cam_ip, cam_loc, cam_name, cam_rtsp_link = fetch_camera_data(cam_id)
    update_env_var("CAM_RSTP",cam_rtsp_link)
    update_env_var("CAM_NAME", cam_name)
    update_env_var("CAM_ID", cam_id)
    update_env_var("CAM_IP", cam_ip)
    update_env_var("CAM_LOCATION",cam_loc)

if __name__ == "__main__":
    init_setup("3")