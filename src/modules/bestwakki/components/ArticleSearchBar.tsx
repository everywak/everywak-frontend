import { useBestwakkiActions, useBestwakkiValue } from '../context';
import SearchBar from './ArticleSearchBar/SearchBar';

export default function ArticleSearchBar() {
  const { updateSearchFilter } = useBestwakkiActions();
  const { searchFilter } = useBestwakkiValue();

  return (
    <SearchBar
      defaultValue={{
        searchTarget: searchFilter.searchTarget || 'title',
        keyword: searchFilter.keyword || ''
      }}
      onSearch={updateSearchFilter}
    />
  );
}
