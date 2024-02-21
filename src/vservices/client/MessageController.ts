// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Users delete user site messages in batches DELETE /v1/message */
export async function removeMessageController(body: number[], options?: { [key: string]: any }) {
  return request<API.ObjectVOInteger>('/v1/message', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Claim all rewards in message POST /v1/message/collect */
export async function collectRewardMessageController(
  body: API.UserMessageCollectRewardAO,
  options?: { [key: string]: any },
) {
  return request<API.ListVOUserMessageCollectRewardVO>('/v1/message/collect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Is there any unread message GET /v1/message/getRead */
export async function getReadMessageController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserMessageHasReadVO>('/v1/message/getRead', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Mark message as read PUT /v1/message/markRead */
export async function markReadMessageController(
  body: API.UserMessageMarkReadAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVOInteger>('/v1/message/markRead', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query user messages by page POST /v1/message/page */
export async function pageMessageController(
  body: API.UserMessagePageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOUserMessageVO>('/v1/message/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
