import { useEffect } from 'react';
import { Member } from 'services/api-v2/module/member.type';
import useStorage from './useStorage';
import { useQueryMember } from './useQueryMember';

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
