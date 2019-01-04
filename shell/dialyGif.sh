#!/bin/bash

DOCKER_DIR="/home/asper/docker"
# DOCKER_DIR="/c/Users/Asper/docker"
APP_DIR=${DOCKER_DIR}"/screenshotToolbox"
APP_NAME="scripts/dialyGif.js"
CONF="../conf/v5townSetting.json"

SOURCE_DIR=${DOCKER_DIR}"/screenshots/hourly"
YESTERDAY=$(date --date='1 days ago' "+%Y-%m-%d")

TARGET_DIR=${DOCKER_DIR}"/screenshots/gif"
TARGET_FILENAME=${YESTERDAY}.gif


mkdir -p ${TARGET_DIR}

node ${APP_DIR}/${APP_NAME} ${CONF} \
 ${SOURCE_DIR}/${YESTERDAY} \
 ${TARGET_DIR}/${TARGET_FILENAME}