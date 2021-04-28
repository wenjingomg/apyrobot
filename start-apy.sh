#!/bin/bash
PID=$(ps -ef|grep 'apys.js main'|grep -v grep|awk '{printf $2}')
if [ -z "$PID" ]
then
    cd /home/ubuntu/xswap-main/apyrobot
    nodejs apys.js main
    cp apy.json /home/ubuntu/www/main/pool.json
    echo apy end
    sleep 1
  
    PID=$(ps -ef|grep 'apys.js main'|grep -v grep|awk '{printf $2}')
    if [ -z "$PID" ]
    then
        kill -9 $PID
    fi
else
    echo apys is already runing
fi
