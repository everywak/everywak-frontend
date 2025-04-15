import { useBestwakkiActions, useBestwakkiValue } from 'contexts/bestwakki';
import SortList from './SortList';

export const SortArticleList = () => {
  const { updateSearchFilter } = useBestwakkiActions();
  const { searchFilter } = useBestwakkiValue();

  const onChangeOrderByHandler = (e: { target: { name: string; value: string } }) => {
    updateSearchFilter({
      orderBy: e.target.value,
    });
  };

  return <SortList name="orderBy" value={searchFilter.orderBy} onChange={onChangeOrderByHandler} />;
};
