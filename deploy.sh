#!/bin/bash

# Exit on any error
set -e

echo "Building the React app..."
npm run build

echo "Deploying to Cloudflare..."
npx wrangler deploy

echo "Deployment complete!" 