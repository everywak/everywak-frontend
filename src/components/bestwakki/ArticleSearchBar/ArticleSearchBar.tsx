import { SearchBar } from '@/common/components';
import { SearchBarValue } from '@/common/components/SearchBar/SearchBar';
import { useBestwakkiActions, useBestwakkiValue } from '@/contexts/bestwakki';

export const ArticleSearchBar = () => {
  const { updateSearchFilter } = useBestwakkiActions();
  const { searchFilter } = useBestwakkiValue();

  const searchTargets = [
    {
      name: '제목',
      value: 'title',
    },
    {
      name: '작성자',
      value: 'author',
    },
    {
      name: '게시판',
      value: 'board',
    },
  ];

  return (
    <SearchBar
      name="search"
      value={{
        searchTarget: searchFilter.searchTarget || 'title',
        keyword: searchFilter.keyword || '',
      }}
      onChange={(e) => updateSearchFilter(e.target.value as SearchBarValue)}
      searchTargets={searchTargets}
    />
  );
};
