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

def check_data_dirs():
    folder_names = ["data","human","lp","municipal","illegal_parking","wrong_way_driving","spiting","urination","garbage_logging","red_light_violation","oversppeding",""]
    for folder_name in folder_names:
        try:
            if not os.path.exists(folder_name):
                os.makedirs(folder_name)
        except:
            return IOError.add_note("Permission denied to create required directory strcuture")

# function to setup requirements before starting the ML engine
def init_setup(cam_id):
    cam_id,cam_ip, cam_loc, cam_name, cam_rtsp_link = fetch_camera_data(cam_id)
    update_env_var("CAM1_RSTP",cam_rtsp_link)
    update_env_var("CAM1_NAME", cam_name)
    update_env_var("CAM1_ID", cam_id)
    update_env_var("CAM_IP", cam_ip)
    update_env_var("CAM1_LOCATION",cam_loc)

if __name__ == "__main__":
    init_setup("2")