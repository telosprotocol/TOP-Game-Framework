
#!/bin/sh
set -ex
PROJECT_NAME=vdmaster_h5
JUMP_SSH_PEM='D:\Docs\key-store\aws-top-v-sg-2023-6-14.pem'
JUMP_CONN=ec2-user@3.1.222.219
REMOTE_CONN=ec2-user@10.0.11.92
REMOTE_PEM='/home/ec2-user/tmp.pem'
PROJECT_DIR=/home/ec2-user/nginx/$PROJECT_NAME
JUMP_TEMP_DIR=/home/ec2-user/h5tmp/

npm run build
tar -zcvf $PROJECT_NAME.tar.gz dist 
# ssh -i 'D:\Docs\key-store\aws-top-v-sg-2023-6-14.pem' ec2-user@3.1.222.219
# ssh -i tmp.pem 10.0.11.92
# scp -i /home/ec2-user/tmp.pem /home/ec2-user/h5tmp/vdmaster_h5.tar.gz ec2-user@10.0.11.92:/home/ec2-user
# transfer file
scp -i "$JUMP_SSH_PEM" $PROJECT_NAME.tar.gz $JUMP_CONN:$JUMP_TEMP_DIR 



SSH_STR="cd $PROJECT_DIR && rm -rf ./dist-old && mkdir -p ./tmp && rm -rf ./tmp/dist && tar -xvf $PROJECT_NAME.tar.gz -C tmp  && mv ./dist ./dist-old && mv ./tmp/dist ./dist && rm -rf ./$PROJECT_NAME.tar.gz"
echo $SSH_STR

ssh -i "$JUMP_SSH_PEM" $JUMP_CONN "scp -i $REMOTE_PEM $JUMP_TEMP_DIR$PROJECT_NAME.tar.gz $REMOTE_CONN:$PROJECT_DIR"


ssh -i "$JUMP_SSH_PEM" $JUMP_CONN "ssh -i tmp.pem $REMOTE_CONN \"$SSH_STR\""

