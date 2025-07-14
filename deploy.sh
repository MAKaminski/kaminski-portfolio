#!/bin/bash

# Exit on any error
set -e

echo "Building the React app..."
npm run build

echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy build --project-name kaminski-portfolio

echo "Deployment complete!" 