import { request } from '../common';
import { SignatureEmoteResponse, StreamInfo } from './afreeca.type';

const base = '/afreeca';

export const getEmote = async (channelId: string) =>
  await request<SignatureEmoteResponse>({
    url: `${base}/emote/${channelId}`,
  });

export const getStream = async (channelId: string) =>
  await request<StreamInfo>({
    url: `${base}/stream/${channelId}`,
  });
