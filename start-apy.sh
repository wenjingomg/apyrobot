#!/usr/bin/sh
PID=$(ps -ef|grep zamo|grep -v grep|awk '{printf $2}')
if [ -z "$PID" ]
then
    nodejs apys.js
    echo apy end
else
    echo apys is already runing
fi
