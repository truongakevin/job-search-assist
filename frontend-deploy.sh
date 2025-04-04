#!/bin/bash

echo "Building Angular project..."
cd frontend
ng build

if [ $? -ne 0 ]; then
  echo "Build failed. Exiting..."
  exit 1
fi

echo "Replacing localhost API URL with production URL..."
find dist/job-assist/browser/ -type f -exec sed -i '' 's/http:\/\/localhost:5687\/job-assist\/generate-cl/https:\/\/kevinatruong.com\/api\/job-assist\/generate-cl/g' {} +

echo "Deploying to the server..."
scp -r dist/job-assist/browser/ linux:~
ssh linux sudo rm -rf /var/www/kevinatruong.com/job-assist/*
ssh linux sudo mv browser/* /var/www/kevinatruong.com/job-assist/


echo "Frontend deployed successfully!"
