# Navigate to the root of the social-media
cd "$(dirname "$0")/.." || exit

api_env_file="./.env"
echo "JWT_KEY=\"secret\"" >> "$api_env_file"
echo "" >> "$api_env_file"
echo "# auth-service" >> "$api_env_file"
echo "POSTGRES_USER=\"auth-depl\"" >> "$api_env_file"
echo "POSTGRES_PASSWORD=\"q8AD0J7n2BuAVTK\"" >> "$api_env_file"