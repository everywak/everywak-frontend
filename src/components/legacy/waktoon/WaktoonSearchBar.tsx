import BasicSearchBar from '@/common/components/legacy/SearchBar/BasicSearchBar';
import { useCallback, useEffect, useState } from 'react';
import * as service from '@/services/Waktoon';

export interface Props {
  onSearch: (e: { value: string; searchTarget: string }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const WaktoonSearchBar = (props: Props) => {
  const [placeholder, setPlaceholder] = useState('');
  const [popularKeywords, setPopularKeywords] = useState(['']);
  const [value, setValue] = useState('');

  // 인기 왁툰 로드
  useEffect(() => {
    updatePopularWaktoonEpisodes();
  }, []);
  const updatePopularWaktoonEpisodes = useCallback(async () => {
    const todayChart = await getPopularWaktoonEpisodes();

    const list = todayChart.map((item) => item.title);
    setPopularKeywords(list);

    // 초기값
    const selectedId = Math.floor(list.length * Math.random());
    setPlaceholder(list[selectedId]);
  }, []);

  // placeholder 순환 루프
  useEffect(() => {
    const loopPlaceholder = setInterval(updatePlaceholder, 10000);
    return () => clearInterval(loopPlaceholder);
  }, [popularKeywords]);

  const updatePlaceholder = useCallback(() => {
    const selectedId = Math.floor(popularKeywords.length * Math.random());

    setPlaceholder(popularKeywords[selectedId]);
  }, [popularKeywords]);

  const _onSearch = useCallback(
    (e: any) => {
      props.onSearch({
        value: !e.value ? placeholder : e.value,
        searchTarget: e.searchTarget,
      });
    },
    [placeholder],
  );

  const { onSearch, ...rest } = props;

  return (
    <BasicSearchBar
      {...rest}
      placeholder={placeholder}
      searchTarget="제목"
      searchTargetOptions={searchOptions}
      onSearch={_onSearch}
      value={value}
    />
  );
};

const searchOptions = [
  {
    name: '제목',
    value: 'title',
  },
  {
    name: '작가',
    value: 'author',
  },
];

async function getPopularWaktoonEpisodes() {
  try {
    const res = await service.getWaktoonEpisodeChart({ orderBy: 'up', perPage: 100 } as any);

    if (res.status !== 200) {
      throw res;
    }

    const todayChart = res.result.waktoonEpisodeChartList;

    return todayChart;
  } catch (err) {
    console.error(err);
    return [];
  }
}
