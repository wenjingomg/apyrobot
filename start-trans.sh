#!/bin/bash
PID=$(ps -ef|grep transSum.js|grep -v grep|awk '{printf $2}')
if [ -z "$PID" ]
then
    cd /home/ubuntu/xswap/apyrobot
    nodejs transSum.js
    cp trans.json /home/ubuntu/www/trans.json
    echo transSum end
    sleep 1
    PID=$(ps -ef|grep transSum.js|grep -v grep|awk '{printf $2}')
    if [ -z "$PID" ]
    then
        kill -9 $PID
    fi
else
    echo transSum is already runing
fi
