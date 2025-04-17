import { ApiError } from './type';

export type RequestParams = {
  url: string;
  params?: Record<string, string | number | boolean>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: JSON;
};

/**
 * API 서버 요청을 보냅니다.
 */
export const request = async <T>({
  url,
  params,
  method = 'GET',
  body,
}: RequestParams): Promise<T> => {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      query.append(key, String(value));
    });
  }
  const _url = `${import.meta.env.VITE_API_V2_URL}${url}${query ? `?${query}` : ''}`;

  const res = await fetch(_url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const error = new Error(errorBody.message || res.statusText) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
};
