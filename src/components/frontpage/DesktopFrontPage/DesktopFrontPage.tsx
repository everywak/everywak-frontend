import React from 'react';
import clsx from 'clsx';
import { EventNoteRounded, FlagRounded, NotificationsRounded } from '@mui/icons-material';
import { CommonHeader, Section, SectionHeader, SubSection } from 'common/components';
import { LivePreview } from 'modules/isedol/LivePreview';
import VideoContentList from 'modules/isedol/VideoContentList';
import NewWakMusicList from 'modules/music/NewWakMusicList';
import WakMusicChartList from 'modules/music/WakMusicChartList';
import FrontWeatherPanel from 'modules/weather/FrontWeatherPanel';
import Apps from 'modules/apps/Apps';
import { AppListItem } from 'modules/apps/AppListItem';
import { AsidePanel, BestwakkiList } from './components';
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
              <VideoContentList size="small" options={{ type: 'youtubeVideo' }} />
            </Section>
            <Section
              title="에브리뮤직"
              more={{
                link: 'https://everywak.kr/music/concert/index.html',
                label: '지난 이세돌 콘서트 바로가기',
              }}
              width="spaceBetween"
            >
              <SubSection title="이 주의 신곡">
                <NewWakMusicList />
              </SubSection>
              <SubSection title="일간 인기차트">
                <WakMusicChartList />
              </SubSection>
            </Section>
          </section>
          <aside>
            <FrontWeatherPanel />
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
                  href: '/board/notice',
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
              ].map<React.ReactNode>((app) => (
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
  );
};
