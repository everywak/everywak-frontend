import { useBestwakkiActions, useBestwakkiValue } from '../context';
import SortList from './SortArticleList/SortList';

export default function SortArticleList() {
  const { updateSearchFilter } = useBestwakkiActions();
  const { searchFilter } = useBestwakkiValue();

  const onChangeOrderByHandler = (e: {
    target: { name: string; value: string };
  }) => {
    updateSearchFilter({
      orderBy: e.target.value
    });
  };

  return (
    <SortList
      name="orderBy"
      value={searchFilter.orderBy}
      onChange={onChangeOrderByHandler}
    />
  );
}
