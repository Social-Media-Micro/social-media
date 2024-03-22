# Navigate to the root of the social-media
cd "$(dirname "$0")/.." || exit

api_env_file="./.env"

echo -e "JWT_KEY=secret
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=30d
JWT_FORGET_PASSWORD_TOKEN_TTL=15m\n
# auth-service
POSTGRES_USER=auth-depl
POSTGRES_PASSWORD=q8AD0J7n2BuAVTK" > "$api_env_file"