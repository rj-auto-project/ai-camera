import os

def update_env_var(key, value, env_file='/home/annone/ai-camera/ML_Backend/.env'):
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
        lines.append(f"{key}={value}\n")

    # Write the updated .env file
    with open(env_file, 'w') as file:
        file.writelines(lines)

    print(f"Updated {key} in {env_file} to {value}")
