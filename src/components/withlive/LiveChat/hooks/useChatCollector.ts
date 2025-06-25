import { useEffect, useState } from 'react';
import { ChatCollectorOption, ChatFilter, ChatFilterTarget } from '../LiveChat.type';
import { useQueryMember, useStorage } from 'hooks';
import { Member } from '@/services/everywak/v2/types/member';

export const useChatCollector = () => {
  const [collectorOption, setCollectorOption] = useStorage<ChatCollectorOption>(
    'everywak.withlive.chat.collectorFilter',
    {
      byRole: ['master', 'isedol', 'gomem', 'academy', 'hardcore'],
      byGroup: ['manager'],
      customFilters: [], // 커스텀 필터
    },
  );
  const [collectorFilters, setCollectorFilters] = useState<ChatFilter[]>([]); // 그룹 옵션까지 적용된 필터

  const { isLoading, data: members } = useQueryMember();

  const updateCollectorOption = (newOption: Partial<ChatCollectorOption>) => {
    setCollectorOption((prev) => ({
      ...prev,
      ...newOption,
    }));
  };

  const getSoopUserId = (member: Member) => {
    const userId = member.livePlatform.find((platform) => platform.type === 'afreeca')?.name;
    if (!userId) {
      return null;
    }
    return userId;
  };
  const geneFilterByRole = (role: string) => {
    const filters: ChatFilter[] = [];
    members
      ?.filter((member) => member.role === role)
      .forEach((member) => {
        const userId = getSoopUserId(member);
        userId &&
          filters.push({
            target: 'userId',
            keyword: userId,
            type: 'include',
          });
      });
    return filters;
  };
  const updateCollectorFilters = () => {
    // 채팅 그룹 옵션 반영
    const filters = [...collectorOption.customFilters];

    collectorOption.byGroup.forEach((group) => {
      filters.push({
        target: 'badge',
        keyword: group,
        type: 'include',
      });
    });
    collectorOption.byRole.forEach((role) => {
      filters.push(...geneFilterByRole(role));
    });

    setCollectorFilters(filters);
  };

  const addChatFilter = (filter: ChatFilter) => {
    setCollectorOption((prev) => {
      const filters = [...prev.customFilters];

      const index = filters.findIndex(
        (f) => f.target === filter.target && f.keyword === filter.keyword && f.type === filter.type,
      );
      if (index === -1) {
        filters.push(filter);
      }

      return { ...prev, customFilters: filters };
    });
  };

  const removeChatFilter = (filter: ChatFilter) => {
    setCollectorOption((prev) => {
      const filters = [...prev.customFilters];

      const index = filters.findIndex(
        (f) => f.target === filter.target && f.keyword === filter.keyword && f.type === filter.type,
      );
      if (index !== -1) {
        filters.splice(index, 1);
      }

      return { ...prev, customFilters: filters };
    });
  };

  useEffect(() => {
    if (!isLoading) {
      updateCollectorFilters();
    }
  }, [collectorOption, isLoading, members]);

  const importChatFilter = () => {
    // 다이얼로그 열어서 text파일 열기

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.txt';

    inputFile.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        parseFile(content);
      };
      reader.readAsText(file);
      //remove element
      inputFile.remove();
    };
    inputFile.click();

    const parseFile = (content: string) => {
      const lines = content.split('\n');
      let target: ChatFilterTarget | null = null;
      lines.forEach((line) => {
        const keyword = line.trim();
        if (keyword === '[닉네임]') {
          target = 'nickname';
        } else if (keyword === '[아이디]') {
          target = 'userId';
        } else if (target && keyword) {
          addChatFilter({
            target,
            keyword,
            type: 'include',
          });
        }
      });
    };
  };

  const exportChatFilter = () => {
    const text: string[] = [];
    text.push(
      `가이드\n[닉네임]와 [아이디] 하단에 각각에 알맞게 한줄에 하나의 유저 정보를 넣어주세요.\n\n`,
    );
    text.push(`[닉네임]`);
    collectorOption.customFilters.forEach((filter) => {
      if (filter.target === 'nickname' && filter.type === 'include') {
        text.push(filter.keyword);
      }
    });
    text.push(`\n[아이디]`);
    collectorOption.customFilters.forEach((filter) => {
      if (filter.target === 'userId' && filter.type === 'include') {
        text.push(filter.keyword);
      }
    });

    const blob = new Blob([text.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'collector-filter.txt';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return {
    collectorOption,
    collectorFilters,
    updateCollectorOption,
    addChatFilter,
    removeChatFilter,
    importChatFilter,
    exportChatFilter,
  };
};
