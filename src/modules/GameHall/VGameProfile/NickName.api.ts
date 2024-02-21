import { requestVGetData, requestVPostData } from '@/http/http';

export function editUserNickName(newName: string) {
  return requestVPostData({
    url: '/v1/user/modify/nickname',
    data: { nickName: newName },
  });
}

export function getUserNicknameIsEditable() {
  return requestVGetData<boolean>({
    url: '/v1/user/nickname/modify',
  });
}
