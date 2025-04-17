import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useBestwakkiQuery } from 'hooks/queries/bestwakki';
import {
  PopularArticlesSelectParams,
  PopularArticle,
  PopularArticlesSelectUrlParams,
} from 'services/everywak/v2/types/bestwakki';
import { PopularArticlesSelectUrlQuerySchema } from 'services/everywak/v2/schemas/bestwakki';

export type Values = {
  readonly articles: PopularArticle[];
  readonly isLoading: boolean;
  readonly isFetchingNextPage: boolean;
  readonly hasNextPage: boolean | undefined;
  readonly searchFilter: PopularArticlesSelectParams;
};

export type Actions = {
  readonly refresh: () => void;
  readonly fetchNextPage: () => void;
  readonly updateSearchFilter: (newFilter: Record<string, string | number>) => void;
};

const BestwakkiValueContext = createContext<Values>({
  articles: [],
  isLoading: true,
  isFetchingNextPage: false,
  hasNextPage: true,
  searchFilter: {
    orderBy: 'time',
    searchTarget: 'title',
    perPage: 30,
    page: 1,
  },
});

const BestwakkiActionsContext = createContext<Actions>({
  refresh() {},
  fetchNextPage() {},
  updateSearchFilter() {},
});

type Props = {
  readonly children: ReactNode;
};

export const BestwakkiProvider = (props: Props): React.ReactNode => {
  const [articles, setArticles] = useState<PopularArticle[]>([]);

  // searchParams filter 전달
  const [searchParams, setSearchParams] = useSearchParams();
  const parseSearchFilter = (searchParams: URLSearchParams) => {
    const params = Object.fromEntries(searchParams.entries());
    const parsed: PopularArticlesSelectUrlParams = {
      searchTarget: 'title',
      orderBy: 'time',
      ...PopularArticlesSelectUrlQuerySchema.safeParse(params).data,
    };
    return parsed;
  };

  const searchFilter: PopularArticlesSelectUrlParams = parseSearchFilter(searchParams);

  /**
   * 검색 필터 변경시 URLParams 반영
   */
  const updateSearchFilter = (newFilter: Record<string, string | number>) => {
    const { orderBy, beginAt, endAt, keyword, searchTarget } = {
      ...searchFilter,
      ...newFilter,
    };

    const params: Record<string, string> = {};
    if (orderBy && orderBy !== 'time') {
      params.orderBy = orderBy;
    }
    if (searchTarget && keyword) {
      params.searchTarget = searchTarget;
      params.keyword = keyword;
    }
    if (beginAt && beginAt > 1424876400000) {
      params.beginAt = '' + Math.floor(beginAt);
    }
    if (endAt && new Date(endAt).toDateString() !== new Date().toDateString()) {
      params.endAt = '' + Math.floor(endAt);
    }
    setSearchParams(params);
  };

  const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBestwakkiQuery({
      params: searchFilter,
    });

  const refresh = () => {
    if (!isLoading) {
      refetch();
    }
  };

  useEffect(() => {
    if (data) {
      setArticles(data.pages.flat());
    }
  }, [data]);

  const actions: Actions = useMemo(
    () => ({
      refresh,
      fetchNextPage,
      updateSearchFilter,
    }),
    [isLoading, refresh, fetchNextPage],
  );

  return (
    <BestwakkiActionsContext.Provider value={actions}>
      <BestwakkiValueContext.Provider
        value={{
          articles,
          isLoading,
          isFetchingNextPage,
          hasNextPage,
          searchFilter,
        }}
      >
        {props.children}
      </BestwakkiValueContext.Provider>
    </BestwakkiActionsContext.Provider>
  );
};

export function useBestwakkiValue() {
  const value = useContext(BestwakkiValueContext);
  if (!value) {
    throw new Error('useBestwakkiValue should be used within BestwakkiProvider');
  }
  return value;
}

export function useBestwakkiActions() {
  const value = useContext(BestwakkiActionsContext);
  if (!value) {
    throw new Error('useBestwakkiActions should be used within BestwakkiProvider');
  }
  return value;
}
