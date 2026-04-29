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

export type MusicListVideo = {
  isShorts: boolean;
  videoId: string;
  publishedTimestamp: string;
  title: string;
  thumbnails: string;
  viewCount: number;
  duration: number;
};

export type MusicListSinger = {
  id: string;
  name: string;
  role: string;
};

export type MusicListItem = {
  id: string;
  title: string;
  singerName: string;
  video: MusicListVideo;
  singers: MusicListSinger[];
};

export type MusicListResponse = MusicListItem[];

export type MusicChartMusic = {
  id: string;
  title: string;
  singerName: string;
  video: MusicListVideo;
};

export type MusicChartItem = {
  id: string;
  duration: string;
  increasedViewCount: number;
  music: MusicChartMusic;
};

export type MusicChartResponse = MusicChartItem[];