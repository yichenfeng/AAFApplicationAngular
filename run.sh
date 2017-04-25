#!/bin/bash

RUNNINGWEBID=$(sudo docker ps --filter "name=aafapplicationangular_web_2" --format '{{.ID}}')
sudo docker stop $RUNNINGWEBID

RUNNINGDATAID=$(sudo docker ps --filter "name=data" --format '{{.ID}}')
sudo docker stop $RUNNINGDATAID

sudo docker-compose up -d --build

CONTAINERID=$(sudo docker ps --filter "name=aafapplicationangular_web_2" --format '{{.ID}}')
echo $CONTAINERID

sudo docker exec $CONTAINERID /opt/web_agents/apache24_agent/bin/agentadmin --s /usr/local/apache2/conf/httpd.conf "https://authservetest.autozone.com:443/auth" "https://trooper.autozone.com:443" "/Employee" "trooper-443" /var/tmp/pw.txt --changeOwner --acceptLicence --forceInstall
sudo docker exec $CONTAINERID apachectl restart
