#!/bin/bash

echo "Building backend..."
cd backend

echo "Deploying to the server..."
scp job-assist.js linux:~
ssh linux sudo rm /var/www/kevinatruong.com/api/job-assist/job-assist.js
ssh linux sudo mv job-assist.js /var/www/kevinatruong.com/api/job-assist/job-assist.js

echo "Restarting Service on Server..."
ssh linux sudo systemctl restart job-assist.service