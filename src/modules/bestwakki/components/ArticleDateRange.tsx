import { useBestwakkiActions, useBestwakkiValue } from '../context';
import DateRange from './ArticleDateRange/DateRange';

export default function ArticleDateRange() {
  const { updateSearchFilter } = useBestwakkiActions();
  const { searchFilter } = useBestwakkiValue();

  const onChangeDateRangeHandler = (e: { start: number; end: number }) => {
    if (searchFilter.beginAt !== e.start || searchFilter.endAt !== e.end) {
      updateSearchFilter({
        beginAt: e.start,
        endAt: e.end,
      });
    }
  };

  const today = new Date();
  const min = 1424876400000,
    max = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  return (
    <DateRange
      name="queryDate"
      min={min}
      max={max}
      start={searchFilter.beginAt}
      end={searchFilter.endAt}
      onChange={onChangeDateRangeHandler}
    />
  );
}
