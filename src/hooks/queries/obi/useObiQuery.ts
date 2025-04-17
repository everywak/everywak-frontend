import { useQuery } from '@tanstack/react-query';
import { EverywakApi } from 'services/everywak';

export const useObiQuery = () => {
  return useQuery([`obi`], EverywakApi.v2.obi.getObi, {
    staleTime: 300_000,
  });
};
