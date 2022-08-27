import React from 'react';

import Apps from './Apps';

import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

class Etcs extends Apps {
  static defaultProps = {
    columns: 1,
    apps: [
      {
        key: 'apps_notice',
        title: '공지사항',
        description: '모두에게 보여줘버렷',
        icon: <NotificationsRoundedIcon />,
        themeColor: '#DF6D34',
        href: '/board/notice',
      },
      {
        key: 'apps_devlog',
        title: '개발 일지',
        description: '한걸음 한걸음',
        icon: <EventNoteRoundedIcon />,
        themeColor: '#83D630',
        href: '/board/devlog',
      },
      {
        key: 'apps_site',
        title: '사이트 운영방침',
        description: '선량한 사이트입니다^^7',
        icon: <FlagRoundedIcon />,
        themeColor: '#DAD21B',
        href: '/siteinfo',
      },
    ]
  };
}

export default Etcs;