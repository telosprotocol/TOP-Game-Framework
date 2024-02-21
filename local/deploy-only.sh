#!/bin/sh
set -ex
# DN 环境部署脚本
# 0. Varibles
PROJECT_NAME=vdmaster_h5
PROJECT_DIR=/home/ec2-user/nginx/$PROJECT_NAME
LOCAL_SSH_PEM='D:\Docs\key-store\139.59.194.229.pem'
SSH_PORT=1022
SSH_CONN=ec2-user@139.59.194.229

echo $PROJECT_DIR

# 1. build test
# npm version prerelease
# npm run deploy:wallet-test
# npm run build:landing-test


# ZIP
rm -rf $PROJECT_NAME.tar.gz
tar -zcvf $PROJECT_NAME.tar.gz dist 
# send to remote, and send *.tar.gz to  direct directory in remote server:
scp -i "$LOCAL_SSH_PEM" -P $SSH_PORT $PROJECT_NAME.tar.gz $SSH_CONN:$PROJECT_DIR

# remove local
rm -rf $PROJECT_NAME.tar.gz


#SSH_STR="cd $PROJECT_DIR && rm -rf ./dist  && tar -xvf $PROJECT_NAME.tar.gz  && rm -rf ./$PROJECT_NAME.tar.gz"

SSH_STR="cd $PROJECT_DIR && rm -rf ./dist-old && mkdir -p ./tmp && rm -rf ./tmp/dist && tar -xvf $PROJECT_NAME.tar.gz -C tmp  && mv ./dist ./dist-old && mv ./tmp/dist ./dist && rm -rf ./$PROJECT_NAME.tar.gz"
echo $SSH_STR

# ssh -i 'D:\Docs\key-store\139.59.194.229.pem' ec2-user@139.59.194.229 -p 1022
# deploy to remote 
# ssh -i "D:\Docs\key-store\139.59.194.229.pem"  ec2-user@139.59.194.229 -p 1022
ssh -i "$LOCAL_SSH_PEM" $SSH_CONN -p $SSH_PORT "$SSH_STR"
