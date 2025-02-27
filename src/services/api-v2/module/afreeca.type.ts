export type StreamInfo = StreamInfoOnline | StreamInfoOffline;

export type StreamInfoOnline = {
  CHANNEL: {
    geo_cc: string;
    geo_rc: string;
    acpt_lang: string;
    svc_lang: string;
    ISSP: number;
    RESULT: 1;
    LOWLAYTENCYBJ: number;
    VIEWPRESET: [[Object], [Object], [Object], [Object], [Object]];
    PBNO: string;
    BNO: string; // 방송 id
    BJID: string; // 스트리머 id
    BJNICK: string; // 스트리머 닉네임
    BJGRADE: number;
    STNO: string;
    ISFAV: string;
    CATE: string;
    CPNO: number;
    GRADE: string;
    BTYPE: string;
    CHATNO: string;
    BPWD: 'N' | 'P'; // 비번방?
    TITLE: string; // 방송제목
    BPS: string; // 비트레이트
    RESOLUTION: string; // 해상도
    CTIP: string;
    CTPT: string;
    VBT: string;
    CTUSER: number;
    S1440P: number;
    AUTO_HASHTAGS: string[];
    CATEGORY_TAGS: string[];
    HASH_TAGS: string[];
    CHIP: string; // 채팅방 ip
    CHPT: string; // 채팅방 포트
    CHDOMAIN: string; // 채팅방 도메인
    GWIP: string;
    GWPT: string;
    STYPE: string;
    CDN: string;
    RMD: string;
    ORG: string;
    MDPT: string;
    BTIME: number;
    DH: number;
    WC: number;
    PCON: number;
    PCON_TIME: number;
    PCON_MONTH: string[];
    PCON_OBJECT: { tier1: SubscriptionBadge[]; tier2: SubscriptionBadge[] };
    FTK: string;
    BPCBANNER: boolean;
    BPCCHATPOPBANNER: boolean;
    BPCTIMEBANNER: boolean;
    BPCPOSTROLL: string;
    BPCPREROLL: string;
    MIDROLL: {
      VALUE: string;
      OFFSET_START_TIME: number;
      OFFSET_END_TIME: number;
    };
    PREROLLTAG: string;
    MIDROLLTAG: string;
    POSTROLLTAG: string;
    BJAWARD: false;
    BJAWARDWATERMARK: false;
    BJAWARDYEAR: string;
    GEM: boolean;
    GEM_LOG: boolean;
    CLEAR_MODE_CATE: string[];
    PLAYTIMINGBUFFER_DURATION: string;
    STREAMER_PLAYTIMINGBUFFER_DURATION: string;
    MAXBUFFER_DURATION: string;
    LOWBUFFER_DURATION: string;
    PLAYBACKRATEDELTA: string;
    MAXOVERSEEKDURATION: string;
  };
};

export type StreamInfoOffline = {
  CHANNEL: {
    geo_cc: string;
    geo_rc: string;
    acpt_lang: string;
    svc_lang: string;
    ISSP: number;
    RESULT: 0;
  };
};

export type SubscriptionBadge = {
  MONTH: number;
  FILENAME: string;
};

export type SignatureEmoteResponse = {
  result: number;
  data: SignatureEmote[];
};

export type SignatureEmote = {
  title: string;
  pc_img: string;
  mobile_img: string;
  pc_alternate_img: string;
  mob_alternate_img: string;
  move_img: 'Y' | 'N';
  order_no: string;
  black_keyword: 'Y' | 'N';
};
