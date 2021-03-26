#!/bin/bash
PID=$(ps -ef|grep apy.js|grep -v grep|awk '{printf $2}')
if [ -z "$PID" ]
then
    nodejs apys.js
    cp apy.json /home/ubuntu/www/pool.json
    echo apy end
    sleep 1
    PID=$(ps -ef|grep apy.js|grep -v grep|awk '{printf $2}')
    if [ -z "$PID" ] then
        kill -9 $PID
    fi
else
    echo apys is already runing
fi
