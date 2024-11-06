import psycopg2
from psycopg2 import OperationalError

def check_postgres_connection(host, database, user, password, port=8080):
    try:
        # Connect to the PostgreSQL database
        connection = psycopg2.connect(
            host=host,
            database=database,
            user=user,
            password=password,
            port=port
        )
        
        # Create a cursor object to interact with the database
        cursor = connection.cursor()
        
        # Execute a simple query to check connection
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        print("Connection successful!")
        print("PostgreSQL Database Version:", db_version)
        
        # Close the cursor and connection
        cursor.close()
        connection.close()
        
    except OperationalError as e:
        print(f"Connection failed: {e}")

# Example usage
host = "34.47.148.81"
port = "8080"
database = "logs"
user = "postgres"
password = "argus123"
check_postgres_connection(host, database, user, password)
