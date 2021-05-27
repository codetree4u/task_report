#!/bin/sh


pushd /jopari/operations/task_list/ 
sed -i 's/000Z)\"/000Z\")/g'  /home/jopari/payerack.json;
sed -i 's/"ISODate (/ISODate (\"/g'  /home/jopari/payerack.json;

sleep 10

mongoimport --jsonArray --db OPS --collection ACKREPORT --upsertFields SILO,SENTDATE --file /home/jopari/payerack.json;
