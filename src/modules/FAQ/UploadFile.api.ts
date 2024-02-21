import { createHttpResponse } from '@/http/createHttpResponse';
import { MS_SECOND } from '@/constants/time';
import axios from 'axios';
import { TransTool } from '@/init/i18n';
import { uploadConfigCommonController } from '@/vservices/client/CommonController';
// import { requestVPostData } from '@/http/http';
// export function uploadFile(file: File) {
//   const formData = new FormData();

//   formData.append('file', file, file.name);
//   return requestVPostData<string>({
//     url: '/v1/game/upload',
//     data: formData,
//     timeout: MS_SECOND * 10,
//   });
// }

function getFileExtension(file: File) {
  const fileType = file.type;
  if (fileType) {
    const list = fileType.split('/');
    if (list[1]) {
      return '.' + list[1];
    }
  }
  const fileName = file.name || '';
  const fileNameParts = fileName.split('.');
  if (fileNameParts.length > 1) {
    return fileNameParts[fileNameParts.length - 1];
  }
}

export async function uploadFile(file: File) {
  const fileNameExtension = getFileExtension(file) || undefined;
  const presignedRes = await uploadConfigCommonController(
    {
      contentType: file.type || 'image/png',
      extension: fileNameExtension,
    },
    {
      timeout: MS_SECOND * 10,
    }
  );
  if (!presignedRes.success) {
    const { data: _data, ...rest } = presignedRes;
    return rest as IHttpResponse<string>;
  }
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    console.log('[DEBUG] presigned ok', presignedRes);
  }
  const presignedInfo = presignedRes.data;
  return new Promise<IHttpResponse<string>>((resolve) => {
    axios
      .put(presignedInfo.putUrl, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(
            createHttpResponse({
              success: true,
              data: presignedInfo.fileUrl,
            })
          );
        } else {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[DEBUG] upload fail', res);
          }
          resolve(
            createHttpResponse({
              success: false,
              code: res.status,
              message:
                res.statusText ||
                (TransTool.Instance.$t(`Base.NETWORK_ERROR`) as string),
            })
          );
        }
      })
      .catch((ex) => {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[DEBUG] upload error', ex);
        }
        resolve(
          createHttpResponse({
            success: false,
            message: TransTool.Instance.$t(`Base.NETWORK_ERROR`) as string,
          })
        );
      });
  });
}
