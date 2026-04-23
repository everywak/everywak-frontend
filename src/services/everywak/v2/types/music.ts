export type Music = {
  id: string;
  videoId: string;
  createdTimestamp: string;
  title: string;
  singerName: string;
};

export type SearchMusicParams = {
  keyword?: string;
  searchTarget?: 'title' | 'singer';
  orderBy?: 'time' | 'time_oldest' | 'view';
  page?: number;
  perPage?: number;
};

export type SearchMusicChartParams = {
  duration: 'hourly' | '24hours' | 'daily' | 'weekly' | 'monthly';
  page?: number;
  perPage?: number;
};
