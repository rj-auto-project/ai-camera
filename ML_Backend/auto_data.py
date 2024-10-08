import os
import paramiko
from scp import SCPClient

def create_ssh_client(hostname, port, username, password):
    # Initialize SSH client
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    # Connect to the SSH server
    client.connect(hostname, port=port, username=username, password=password)
    return client

def send_images_to_ssh(local_folder, ssh_client, remote_folder):
    # Create SCP client
    with SCPClient(ssh_client.get_transport()) as scp:
        # Iterate through all files in the folder
        for file_name in os.listdir(local_folder):
            file_path = os.path.join(local_folder, file_name)
            
            # Check if the file is an image (can be extended based on image formats)
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                print(f"Sending {file_name}...")
                
                # Send the file to the remote folder
                scp.put(file_path, remote_folder)
                print(f"{file_name} sent successfully.")

if __name__ == "__main__":
    # SSH connection details
    hostname = "34.47.148.81"
    port = 22  # Default SSH port
    username = "devendra"

    # Paths
    local_folder = "c:/project/ai-camera/ML_Backend/cropped_images/person"  # Replace with your folder containing images
    remote_folder = "/home/devendra/dataset"  # Replace with remote folder path

    # Create an SSH client and send images
    
    ssh_client = create_ssh_client(hostname, port, username,"")
    print(ssh_client)
    send_images_to_ssh(local_folder, ssh_client, remote_folder)
    # finally:
    #     ssh_client.close()
