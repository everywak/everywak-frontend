import { request } from '../common';
import { OBI, OBISelectParams } from '../types/obi';

const base = '/obi';

/**
 * 최근 7일간 뱅온정보 조회
 */
export const getObi = () =>
  request<OBI[]>({
    url: `${base}`,
  });

/**
 * 특정 날짜 뱅온정보 조회
 */
export const getObiByDate = (params: OBISelectParams) =>
  request<OBI[]>({
    url: `${base}/${params.date}`,
  });
