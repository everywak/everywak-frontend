import { useQuery } from '@tanstack/react-query';

import * as Everywak from 'services/everywak/v2/index';

export function useQueryLive(rest?: any) {
  const fetch = async () => {
    try {
      const lives = await Everywak.live.getLives();
      return lives;
    } catch (error) {
      throw error;
    }
  };

  return useQuery([`waktaverseLives`], fetch, {
    staleTime: 15000,
    ...rest,
  });
}
