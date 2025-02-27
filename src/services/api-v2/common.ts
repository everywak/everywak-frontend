import axios from 'axios';

export type RequestParams = {
  url: string;
  params?: Record<string, string | number | boolean>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: JSON;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_V2_URL,
});

/**
 * API 서버 요청을 보냅니다.
 */
export const request = async <T>({
  url,
  params,
  method = 'GET',
  body,
}: RequestParams): Promise<T> => {
  const options = {
    url,
    method,
    mode: 'cors',
    params,
    data: typeof body === 'string' ? body : JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    //withCredentials: true,
  };

  const response = await api(options);
  return response.data;
};
