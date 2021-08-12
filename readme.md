# A Full Stack price tracker

## Demo

![](demo.gif?raw=true)

## Disclaimer

I build this app for my own to remind me that the games (only Hong Kong switch eShop) on wishlist are on discount and check for the prices history. I build an app since it can send push notification.Due to copyright issue, I am keeping it for my own use. If you want to try it out, please contact me.

## Production

The backend server is deployed in digital ocean.
The frontend is built to apk and for android only due to copyright issues.

## Crawler to get prices

get into price-crawler folder and run

# Local development

## setup rabbit mq using docker

docker run -d --name myrabbitmq -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password -v /Users/kwcng/dev/docker-volume/rabbitmq/data:/var/lib/rabbitmq/ -v /Users/kwcng/dev/docker-volume/rabbitmq/logs:/var/log/rabbitmq/ -p 5672:5672 -p 15672:15672 rabbitmq:3-management-alpine

## init the database with price-crawler/src/initDataBase.ts
