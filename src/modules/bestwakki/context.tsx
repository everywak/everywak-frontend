import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { PopularArticle } from 'services/everywak-api/modules/bestwakki';

import useQueryBestwakki from 'hooks/useQueryBeskwakki';
import { ListOrder, SearchFilter, SearchTarget } from './types';

export type Values = {
  readonly articles: PopularArticle[];
  readonly isLoading: boolean;
  readonly isFetchingNextPage: boolean;
  readonly hasNextPage: boolean | undefined;
  readonly searchFilter: SearchFilter;
};

export type Actions = {
  readonly refresh: () => void;
  readonly fetchNextPage: () => void;
  readonly updateSearchFilter: (
    newFilter: Record<string, string | number>
  ) => void;
};

const BestwakkiValueContext = createContext<Values>({
  articles: [],
  isLoading: true,
  isFetchingNextPage: false,
  hasNextPage: true,
  searchFilter: {
    orderBy: 'time',
    beginAt: -1,
    endAt: -1,
    searchTarget: 'title',
    keyword: '',
    perPage: 30,
    page: 1
  }
});

const BestwakkiActionsContext = createContext<Actions>({
  refresh() {},
  fetchNextPage() {},
  updateSearchFilter() {}
});

type Props = {
  readonly children: ReactNode;
};

export function BestwakkiProvider(props: Props): JSX.Element {
  const [articles, setArticles] = useState<PopularArticle[]>([]);

  // searchParams filter 전달
  const [searchParams, setSearchParams] = useSearchParams();
  const _orderBy = searchParams.get('orderBy') || 'time';
  const _beginAt = parseInt(searchParams.get('beginAt') || '-1');
  const _endAt = parseInt(searchParams.get('endAt') || '-1');
  const _queryTxt = searchParams.get('queryTxt') || '';
  const _queryTarget = searchParams.get('queryTarget') || 'title';

  /**
   * 검색 필터 변경시 URLParams 반영
   */
  const updateSearchFilter = (newFilter: Record<string, string | number>) => {
    const { orderBy, beginAt, endAt, keyword, searchTarget } = {
      ...searchFilter,
      ...newFilter
    };

    const params: Record<string, string> = {};
    if (orderBy && orderBy !== 'time') {
      params.orderBy = orderBy;
    }
    if (searchTarget && keyword && keyword !== '') {
      params.queryTarget = searchTarget;
      params.queryTxt = keyword;
    }
    if (beginAt !== -1 && beginAt !== 1424876400000) {
      params.beginAt = '' + Math.floor((beginAt as number) / 1000);
    }
    const endDate = new Date(endAt);
    const todayDate = new Date();
    if (endAt !== -1 && endDate.toDateString() !== todayDate.toDateString()) {
      params.endAt = '' + Math.floor((endAt as number) / 1000);
    }
    setSearchParams(params);
  };

  const searchFilter: SearchFilter = {
    beginAt: !isNaN(_beginAt) && _beginAt !== -1 ? _beginAt * 1000 : -1,
    endAt: !isNaN(_endAt) && _endAt !== -1 ? _endAt * 1000 : -1,
    orderBy: 'time',
    perPage: 30,
    page: 1,
    searchTarget: 'title',
    keyword: ''
  };

  if (
    _orderBy &&
    ['time', 'time_oldest', 'up', 'comment', 'read'].includes(_orderBy)
  ) {
    searchFilter.orderBy = _orderBy as ListOrder;
  }
  if (_queryTxt) {
    searchFilter.keyword = _queryTxt;
  }
  if (_queryTarget && ['title', 'author', 'board'].includes(_queryTarget)) {
    searchFilter.searchTarget = _queryTarget as SearchTarget;
  }

  const {
    isLoading,
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useQueryBestwakki({
    searchFilter
  });

  const refresh = () => {
    if (!isLoading) {
      refetch();
    }
  };

  useEffect(() => {
    if (data) {
      setArticles(data.pages.flatMap(page => page.popularArticleList));
    }
  }, [data]);

  const actions: Actions = useMemo(
    () => ({
      refresh,
      fetchNextPage,
      updateSearchFilter
    }),
    [isLoading, refresh, fetchNextPage]
  );

  return (
    <BestwakkiActionsContext.Provider value={actions}>
      <BestwakkiValueContext.Provider
        value={{
          articles,
          isLoading,
          isFetchingNextPage,
          hasNextPage,
          searchFilter
        }}
      >
        {props.children}
      </BestwakkiValueContext.Provider>
    </BestwakkiActionsContext.Provider>
  );
}

export function useBestwakkiValue() {
  const value = useContext(BestwakkiValueContext);
  if (!value) {
    throw new Error(
      'useBestwakkiValue should be used within BestwakkiProvider'
    );
  }
  return value;
}

export function useBestwakkiActions() {
  const value = useContext(BestwakkiActionsContext);
  if (!value) {
    throw new Error(
      'useBestwakkiActions should be used within BestwakkiProvider'
    );
  }
  return value;
}
