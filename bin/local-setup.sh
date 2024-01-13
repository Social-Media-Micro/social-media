#!/bin/bash

# Ensure script is running from the project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
cd "$PROJECT_ROOT" || exit

# Install dependencies 
yarn install

# Function to create/update .env file
create_env_file() {
  FILE_PATH="$1"
  if [ -f "$FILE_PATH" ]; then
    echo ".env file already exists at $FILE_PATH. Skipping creation."
    return
  fi

  touch "$FILE_PATH" || { echo "Error: Unable to create $FILE_PATH"; exit 1; }

  echo "PORT=4000" >> "$FILE_PATH"
  echo "MONGODB_URI=mongodb://0.0.0.0:27020/social-media" >> "$FILE_PATH"
  echo "JWT_SECRET=secret" >> "$FILE_PATH"
  echo "" >> "$FILE_PATH"
  echo "# The following variables are required for sending emails" >> "$FILE_PATH"
  echo "EMAIL_SERVICE=" >> "$FILE_PATH"
  echo "EMAIL_HOST=" >> "$FILE_PATH"
  echo "EMAIL_REJECT_UNAUTHORIZED=true" >> "$FILE_PATH"
  echo "EMAIL_SECURE=true" >> "$FILE_PATH"
  echo "EMAIL_PORT=" >> "$FILE_PATH"
  echo "EMAIL_USER=" >> "$FILE_PATH"
  echo "EMAIL_PASS=" >> "$FILE_PATH"
  echo "Created .env file at $FILE_PATH"
}
# Create .env file in the 'api' package
API_ENV_FILE="./packages/api/.env"
create_env_file "$API_ENV_FILE"


# Create .env file in the '@social-media/ui-web' package
UI_WEB_ENV_FILE="./packages/ui-web/.env"
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:4000" > "$UI_WEB_ENV_FILE"
echo "Created .env file at $UI_WEB_ENV_FILE"

echo "Local setup completed!"
