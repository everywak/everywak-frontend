import React from 'react';
import clsx from 'clsx';
import { EventNoteRounded, FlagRounded, NotificationsRounded } from '@mui/icons-material';
import { CommonHeader, Footer, Section, SectionHeader } from 'common/components';
import { LivePreview } from 'components/live';
import { VideoContentList } from 'components/video';
import { AppListItem } from 'components/frontpage/common/Apps/AppListItem';
import { Apps, WeatherPanel } from '../common';
import { AsidePanel, BestwakkiList, EverymusicSection } from './components';
import styles from './DesktopFrontPage.module.scss';

export const DesktopFrontPage = () => {
  const isedol = [
    '01HTYXH5RAR4NPW1Y1QD96FF6M',
    '01HTYXYSS3YFAAPBR648J2DPHD',
    '01HTYY59CYV8A58633V2BYWGGD',
    '01HTYYB6AKM8QS519FD9WMKNPG',
    '01HTYYFXH1GSSQD584HDTVMN2V',
    '01HTYYN8ZGT1X22F9DM5BVB1RG',
  ];
  const leftLiveList = isedol
    .slice(0, 3)
    .map((id) => <LivePreview key={`livepanel_${id}`} memberId={id} />);
  const rightLiveList = isedol
    .slice(3, 6)
    .map((id) => <LivePreview key={`livepanel_${id}`} memberId={id} />);

  return (
    <>
      <main className={clsx('FrontPage', styles.container)}>
        <CommonHeader
          className={styles.header}
          title="에브리왁굳"
          links={[
            { key: 'withlive', name: '왁타버스 같이보기', href: '/withlive' },
            { key: 'bestwakki', name: '왁물원 인기글', href: '/bestwakki' },
            { key: 'waktoon', name: '왁굳코믹스', href: '/waktoon' },
          ]}
          subtitle="언제 어디서나 왁타버스와 함께!"
          description={
            '우왁굳, 고멤 그리고 이세돌 생방송부터\n편집 영상들을 한 눈에!\n마르지 않는 샘물을 에브리왁굳에서 즐겨보세요!'
          }
          more={[{ key: 'withlive', name: '왁타버스 같이보기', href: '/withlive' }]}
        >
          <div className={styles.lives}>
            <div className={styles.side}>{leftLiveList}</div>
            <div className={styles.center}>
              <LivePreview memberId="01HTYWPTRQPMBBN03797C60NZQ" />
            </div>
            <div className={styles.side}>{rightLiveList}</div>
          </div>
        </CommonHeader>
        <section className={styles.content}>
          <section className={styles.twoColumns}>
            <section className={styles.videoAndMusic}>
              <Section title="왁타버스 유튜브" width="spaceBetween">
                <VideoContentList size="small" options={{ type: 'youtubeVideo' }} type="slide" />
              </Section>
              <EverymusicSection />
            </section>
            <aside>
              <WeatherPanel />
              <AsidePanel title="왁물원 인기글" more={{ link: '/bestwakki', label: '더 보기' }}>
                <BestwakkiList />
              </AsidePanel>
              <AsidePanel title="게시판">
                {[
                  {
                    key: 'apps_notice',
                    title: '공지사항',
                    description: '모두에게 보여줘버렷',
                    icon: <NotificationsRounded />,
                    themeColor: '#DF6D34',
                    href: 'https://cafe.naver.com/ArticleSearchList.nhn?search.clubid=27842958&search.searchdate=all&search.searchBy=1&search.query=%BF%A1%BA%EA%B8%AE%BF%CE%B1%BB&search.defaultValue=1&search.includeAll=&search.exclude=&search.include=&search.exact=&search.sortBy=date&userDisplay=15&search.media=0&search.option=0&search.menuid=659',
                  },
                  {
                    key: 'apps_devlog',
                    title: '개발 일지',
                    description: '한걸음 한걸음',
                    icon: <EventNoteRounded />,
                    themeColor: '#83D630',
                    href: '/board/devlog',
                  },
                  {
                    key: 'apps_site',
                    title: '사이트 운영방침',
                    description: '선량한 사이트입니다^^7',
                    icon: <FlagRounded />,
                    themeColor: '#DAD21B',
                    href: 'https://everywak.kr/yourinfo',
                  },
                ].map((app) => (
                  <AppListItem size="small" {...app} />
                ))}
              </AsidePanel>
            </aside>
          </section>
          <section className={styles.apps}>
            <SectionHeader title="여러가지가 있읍니다" size="max" />
            <Apps columns={3} />
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};
