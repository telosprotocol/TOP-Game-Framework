 
#!/bin/sh
set -ex
# PN 环境部署脚本
# 0. Varibles
PROJECT_NAME=vdmaster_h5
PROJECT_DIR=/home/ec2-user/nginx/$PROJECT_NAME
LOCAL_SSH_PEM='D:\Docs\key-store\aws-top-v-sg-2023-6-14.pem'
SSH_PORT=22
SSH_CONN=ec2-user@10.0.11.92

echo $PROJECT_DIR

# 1. build test
npm run build


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
 
ssh -i "$LOCAL_SSH_PEM" $SSH_CONN -p $SSH_PORT "$SSH_STR"
