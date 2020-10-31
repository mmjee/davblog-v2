#!/bin/bash

rclone serve webdav -vvv --dir-cache-time 0m1s --addr localhost:5001 data/
