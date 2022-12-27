#!/bin/bash

desired_time="12:00"

while true; do
  current_time=$(date +%H:%M)

  if [ "$current_time" == "$desired_time" ]; then
    npm start
  fi

  sleep 60
done
