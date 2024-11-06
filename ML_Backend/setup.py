from db import Database
from utils import update_env_var
import os
from dotenv import load_dotenv

load_dotenv()

# fetch camera details
def fetch_camera_data(cam_id :str):
    try:
        conn = Database.get_connection()
        cursor = conn.cursor()
        print(cam_id)
        query = '''SELECT "cameraId", "cameraIp", "location", "cameraName", "rtspLink", "illegalParkingCords", "redlightCrossingCords", "wrongwayCords" FROM "Camera" WHERE "status"= "ACTIVE"'''
        cursor.execute(query,(cam_id,))
        rows = cursor.fetchone()
        cursor.close()
        conn.close()
        return rows
    except (Exception) as error:
        print(f"Error fetching data from PostgreSQL table: {error}")

def check_data_dirs(parent_dir):
    folder_names = ["human","lp","municipal","illegal_parking","wrong_way_driving","spiting","urination","garbage_logging","red_light_violation","oversppeding",]
    data_dir = os.path.join(parent_dir,"data")
    print(data_dir)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    for folder_name in folder_names:
        try:
            print()
            if not os.path.exists(f"{data_dir}/{folder_name}"):
                os.makedirs(f"{data_dir}/{folder_name}")
        except:
            print("permission denies")

# function to setup requirements before starting the ML engine
def init_setup():
    try:
        check_data_dirs(os.getenv("PARENT_DIR"))
    except:
        print("Permission denied for Constants Overwritting")
    try:
        cam_id,cam_ip, cam_loc, cam_name, cam_rtsp_link, illegal_parking_coords,redlightCrossingCords, wrongwayCords = fetch_camera_data(cam_id)
        try:
            update_env_var("CAM_RTSP",cam_rtsp_link)
            update_env_var("CAM_NAME", cam_name)
            update_env_var("CAM_ID", cam_id)
            update_env_var("CAM_IP", cam_ip)
            update_env_var("CAM_LOCATION",cam_loc)
            update_env_var("ILLEGAL_PARKING_ZONE_COORDS",illegal_parking_coords)
            update_env_var("RED_LIGHT_LINE_PAIR",redlightCrossingCords)
            if wrongwayCords:
                pairs = []
                for pair in wrongwayCords:
                    red_line = pair["red"][0]
                    green_line = pair["green"][0]
                    pairs.append([[(int(red_line["startX"]),int(red_line["startY"])),(int(red_line["endX"]),int(red_line["endY"]))],[(int(green_line["startX"]),int(green_line["startY"])),(int(green_line["endX"]),int(green_line["endY"]))]])
                update_env_var("WRONG_WAY_LINE_PAIR",pairs)
            if redlightCrossingCords:
                pairs = []
                for pair in redlightCrossingCords:
                    red_line = pair["red"][0]
                    green_line = pair["green"][0]
                    pairs.append([[(int(red_line["startX"]),int(red_line["startY"])),(int(red_line["endX"]),int(red_line["endY"]))],[(int(green_line["startX"]),int(green_line["startY"])),(int(green_line["endX"]),int(green_line["endY"]))]])
                update_env_var("RED_LIGHT_LINE_PAIR",pairs)
        except:
            print("Permission denied for Constants Overwritting")
    except:
        print("No Cameras registery found")
if __name__ == "__main__":
    init_setup()
