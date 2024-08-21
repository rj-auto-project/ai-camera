import psycopg2
import pandas as pd
from deepface import DeepFace
import sys
import json

# PostgreSQL connection details
DB_HOST = "34.47.148.81"
DB_NAME = "logs"
DB_USER = "root"
DB_PASS = "team123"
DB_PORT = "8080"

# Function to connect to the database
def connect_db():
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        return connection
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        sys.exit(1)

# Function to retrieve images from the database
def get_images_from_db(connection):
    query = "SELECT id, image_path FROM your_table_name"
    return pd.read_sql_query(query, connection)

# Function to perform face recognition
def recognize_face(image_path, db_images):
    try:
        # Compare the input image with all images in the database
        result = DeepFace.find(img_path=image_path, db_path=None, enforce_detection=False)
        
        matches = []
        for index, row in db_images.iterrows():
            if len(result) > 0:
                best_match = result.iloc[0]
                if best_match['identity'] == row['image_path']:
                    matches.append({"id": row['id'], "image_path": row['image_path']})
        
        if len(matches) > 0:
            return json.dumps({"status": "success", "matches": matches})
        else:
            return json.dumps({"status": "not found"})

    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})

# Main function
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python face_recognition.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    connection = connect_db()
    
    db_images = get_images_from_db(connection)
    
    result = recognize_face(image_path, db_images)
    
    connection.close()
    
    print(result)
