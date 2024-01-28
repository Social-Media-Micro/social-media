#!/bin/bash

# Set your DockerHub username
DOCKER_USERNAME="muddledluck170"

# Navigate to the packages directory
cd ./packages || exit

# Loop through each directory in packages
for dir in */; do
    # Check if Dockerfile exists in the directory
    if [ -f "${dir}Dockerfile" ]; then
        # Build Docker image using the root directory as the context
        docker build -t "${DOCKER_USERNAME}/${dir%/}" -f "${dir}Dockerfile" ../
        
        # Push Docker image to DockerHub
        docker push "${DOCKER_USERNAME}/${dir%/}"
    else
        echo "Dockerfile not found in ${dir}, skipping..."
    fi
done
