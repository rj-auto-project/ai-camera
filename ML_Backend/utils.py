import os
import cv2

def update_env_var(key, value, env_file='C:/project/ai-camera/ML_Backend/.env'):
    lines = []
    key_found = False

    # Read the current .env file
    if os.path.exists(env_file):
        with open(env_file, 'r') as file:
            lines = file.readlines()

        # Modify the variable if it exists
        for i, line in enumerate(lines):
            if line.startswith(f"{key}="):
                lines[i] = f"{key}={value}\n"
                key_found = True
                break

    # If the key wasn't found, append it
    if not key_found:
        lines.append(f"{key}={value}/n")

    # Write the updated .env file
    with open(env_file, 'w') as file:
        file.writelines(lines)

    print(f"Updated {key} in {env_file} to {value}")


def get_frame_dimensions(rtsp_link):
    cap = cv2.VideoCapture(rtsp_link)
    if not cap.isOpened():
        print("Error: Unable to open video stream.")
        return None, None
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()
    return width, height