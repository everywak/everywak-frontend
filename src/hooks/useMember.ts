import { useEffect } from 'react';
import { Member } from 'services/everywak/v2/types/member';
import { useStorage, useQueryMember } from '.';

export function useMember() {
  const [members, setMembers] = useStorage<Member[]>('everywak.members', []);
  const { isLoading, data: fetchedData } = useQueryMember({
    refreshInterval: 30000,
  });

  useEffect(() => {
    if (!isLoading && fetchedData) {
      setMembers(fetchedData);
    }
  }, [isLoading, fetchedData]);

  return members;
}
