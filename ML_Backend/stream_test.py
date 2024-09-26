import cv2

# RTSP link
rtsp_url = "rtsp://192.168.1.3:8554/stream"  # Replace with your RTSP URL

# Open the video stream
cap = cv2.VideoCapture(rtsp_url)

# Check if the video stream opened successfully
if not cap.isOpened():
    print("Error: Unable to open the video stream")
    exit()

# Read and display frames in a loop
while True:
    ret, frame = cap.read()
    cv2.resize(frame, (640,480))

    if not ret:
        print("Error: Unable to read frame from stream")
        break

    # Display the frame
    cv2.imshow('RTSP Stream', frame)

    # Exit the stream on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture and close windows
cap.release()
cv2.destroyAllWindows()
