#!/bin/bash
PID=$(ps -ef|grep apy.js|grep -v grep|awk '{printf $2}')
if [ -z "$PID" ]
then
    nodejs apys.js
    echo apy end
    PID=$(ps -ef|grep apy.js|grep -v grep|awk '{printf $2}')
    if [ -z "$PID" ]
    kill -9 $PID
else
    echo apys is already runing
fi
