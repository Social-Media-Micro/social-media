#!/bin/bash
# Navigate to the root of the social-media
cd "$(dirname "$0")/.." || exit

# Check if the secret exists
if kubectl get secret my-secret >/dev/null 2>&1; then
    # Delete the existing secret
    kubectl delete secret my-secret
    echo "Existing secret deleted."
fi

# Recreate the secret from the new file
kubectl create secret generic my-secret --from-file=./.env

echo "Secret updated successfully."