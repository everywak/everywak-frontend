import { useQuery } from '@tanstack/react-query';
import { EverywakApi } from 'services/everywak';
import { OBISelectParams } from 'services/everywak/v2/types/obi';

export const useObiByDateQuery = (params: OBISelectParams) => {
  return useQuery([`obiByDate`, params.date], () => EverywakApi.v2.obi.getObiByDate(params), {
    staleTime: 300_000,
  });
};
