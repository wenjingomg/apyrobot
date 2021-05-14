#!/bin/bash
PID=$(ps -ef|grep 'apys.js hsc'|grep -v grep|awk '{printf $2}')
if [ -z "$PID" ]
then
    cd /home/ubuntu/xswap-hsc/apyrobot
    nodejs apys.js hsc
    cp apy.json /home/ubuntu/www/hsc/pool.json
    echo apy end
    sleep 1
  
    PID=$(ps -ef|grep 'apys.js hsc'|grep -v grep|awk '{printf $2}')
    if [ -z "$PID" ]
    then
        kill -9 $PID
    fi
else
    echo apys is already runing
fi
