export type Member = {
  id: string;
  name: string;
  role: string;
  profile: Profile;
  livePlatform: LivePlatform[];
  youtubeChannel: YoutubeChannel[];
  social: Social[];
};

export type MemberSimple = {
  id: string;
  name: string;
  role: string;
};

export type Profile = {
  id: string;
  profileImage: string;
  offlineImage: string;
};

export type LivePlatform = {
  id: string;
  type: string;
  name: string;
  channelId: string;
};

export type YoutubeChannel = {
  id: string;
  type: string;
  name: string;
  channelId: string;
  uploads: string;
};

export type Social = {
  id: string;
  type: string;
  name: string;
  userId: string;
};
