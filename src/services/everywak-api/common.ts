import axios from 'axios';

export type CommonMessage<T> = {
  message: { status: 200; result: T };
};
export type CommonError = {
  message: {
    status: 403 | 404 | 500 | 501 | 502;
    error: { code: number; msg: string };
  };
};

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
});

export type RequestParams = {
  method: 'GET' | 'POST';
  uri: string;
  params?: Record<string, string | number | undefined>;
  data?: Record<string, any>;
};

/**
 * API 서버 요청을 보냅니다.
 */
const request = async <T>({
  method = 'GET',
  uri,
  params,
  data,
}: RequestParams): Promise<CommonError | CommonMessage<T>> => {
  const options = {
    method,
    mode: 'cors',
    params,
    data,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    withCredentials: true,
  };
  const response = await api(uri, options);

  return response.data;
};

export { request };
