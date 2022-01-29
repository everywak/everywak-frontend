import Apps from './Apps';

class Etcs extends Apps {
  static defaultProps = {
    columns: 1,
    apps: [
      {
        key: 'apps_notice',
        title: '공지사항',
        description: '모두에게 보여줘버렷',
        thumbnail: null,
        href: '/board/notice',
      },
      {
        key: 'apps_devlog',
        title: '개발 일지',
        description: '한걸음 한걸음',
        thumbnail: null,
        href: '/board/devlog',
      },
      {
        key: 'apps_site',
        title: '사이트 운영방침',
        description: '선량한 사이트입니다^^7',
        thumbnail: null,
        href: '/siteinfo',
      },
    ]
  };
}

export default Etcs;