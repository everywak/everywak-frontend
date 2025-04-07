import { useQuery } from '@tanstack/react-query';

import * as Everywak from 'services/api-v2/index';

export function useQueryMember(rest?: any) {
  const fetch = async () => {
    try {
      const res = await Everywak.member.getMembers();
      return res;
    } catch (error) {
      throw error;
    }
  };

  return useQuery([`waktaverseMembers`], fetch, {
    staleTime: 15000,
    ...rest,
  });
}
