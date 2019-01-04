#!/bin/bash

DOCKER_DIR="/home/asper/docker"
# DOCKER_DIR="/c/Users/Asper/docker"

APP_DIR=${DOCKER_DIR}"/screenshotToolbox"
APP_NAME="scripts/screenshotJson.js"

TODAY=$(date +%Y-%m-%d)
CONF="../conf/leftCSetting.json"

TARGET_DIR=${DOCKER_DIR}"/screenshots/leftc"
TARGET_TODAY_DIR=${TARGET_DIR}/${TODAY}
TARGET_FILENAME=$(date +%Y-%m-%dT%H_%M+0800Z.png)


mkdir -p ${TARGET_DIR}
cd ${TARGET_DIR}


docker run --shm-size 1G --rm \
 -e "TZ=Asia/Taipei" \
 -v ${APP_DIR}:/app \
 -v ${TARGET_TODAY_DIR}:/screenshots \
 alekzonder/puppeteer:latest \
 node ${APP_NAME} ${CONF} ${TARGET_FILENAME}


# create latest.png symlink
if [ -f "${TODAY}/${TARGET_FILENAME}" ]
then
	rm -f latest.png
	ln -s ${TODAY}/${TARGET_FILENAME} latest.png
    echo ${TARGET_FILENAME} > ${TARGET_DIR}/latest.meta
fi
