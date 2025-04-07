import React from 'react';
import { Link } from 'react-router-dom';

import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

import * as func from '../../common/functions';
import { Desktop, NotDesktop } from '../../common/MediaQuery';

import Apps from '../apps/Apps';
import AppListItem from '../apps/AppListItem';

import CommonHeader from './CommonHeader';
import LivePreview from '../isedol/LivePreview';

import ContentPanel from './ContentPanel';
import ContentSubPanel from './ContentSubPanel';
import AsidePanel from './AsidePanel';
import SectionHeader from './SectionHeader';

import FrontWeatherPanel from '../weather/FrontWeatherPanel';
import FrontBestwakkiList from './FrontBestwakkiList';
import VideoContentList from '../isedol/VideoContentList';
import NewWakMusicList from '../music/NewWakMusicList';
import WakMusicChartList from '../music/WakMusicChartList';

import FrontAppList from '../apps/FrontAppList';

import './Frontpage.scss';
import cx from 'classnames';

function Frontpage() {
  func.setBrowserTitle('메인');

  return (
    <>
      <Desktop>
        <DesktopFrontpage />
      </Desktop>
      <NotDesktop>
        <MobileFrontpage />
      </NotDesktop>
    </>
  );
}

function DesktopFrontpage() {
  const isedol = ['vo_ine', 'jingburger', 'lilpaaaaaa', 'cotton__123', 'gosegugosegu', 'viichan6'];
  const leftLiveList = isedol
    .slice(0, 3)
    .map((id) => <LivePreview key={`livepanel_${id}`} channelId={id} />);
  const rightLiveList = isedol
    .slice(3, 6)
    .map((id) => <LivePreview key={`livepanel_${id}`} channelId={id} />);

  return (
    <div className="FrontPage desktop">
      <CommonHeader
        title="에브리왁굳"
        categories={[
          { key: 'withlive/isedol', name: '이세돌 같이보기', href: '/withlive/isedol' },
          { key: 'bestwakki', name: '왁물원 인기글', href: '/bestwakki' },
          { key: 'waktoon', name: '왁굳코믹스', href: '/waktoon' },
          //{key: 'clip', name: '왁굳TV', href: '/video'}
        ]}
        subtitle="언제 어디서나 왁타버스와 함께!"
        description={
          '계륵님, 고멤 그리고 이세돌 생방송부터\n이제는 볼 수 없는 트위치 핫클립까지\n마르지 않는 샘물을 에브리왁굳에서 즐겨보세요!'
        }
        moreLink={[
          { key: 'live', name: '생방송 보러가기', href: '/live' },
          { key: 'withlive/isedol', name: '이세돌 같이 보기', href: '/withlive/isedol' },
        ]}
      >
        <div className="liveList">
          <div className="side">{leftLiveList}</div>
          <div className="center">
            <LivePreview channelId="woowakgood" size="big" />
          </div>
          <div className="side">{rightLiveList}</div>
        </div>
      </CommonHeader>
      <main className="content">
        <section className="twoColumns">
          <section className="content">
            <ContentPanel
              className="main waktaverseYoutube"
              title="왁타버스 유튜브"
              /*moreLink="/video"*/ moreLabel="왁굳TV에서 더 보기"
              width="spaceBetween"
            >
              <VideoContentList
                className="waktaverseVideoList"
                size="small"
                options={{ type: 'youtubeVideo' }}
              />
            </ContentPanel>
            <ContentPanel
              className="main wakMusic"
              title="에브리뮤직"
              moreLink="https://everywak.kr/music/concert"
              moreLabel="이세돌 콘서트 바로가기"
              width="spaceBetween"
            >
              <ContentSubPanel className="sub newMusic" title="이 주의 신곡">
                <NewWakMusicList />
              </ContentSubPanel>
              <ContentSubPanel className="sub dailyChart" title="일간 인기차트">
                <WakMusicChartList />
              </ContentSubPanel>
            </ContentPanel>
          </section>
          <aside>
            <FrontWeatherPanel />
            <AsidePanel title="왁물원 인기글" moreLink="/bestwakki">
              <FrontBestwakkiList />
            </AsidePanel>
            <AsidePanel title="게시판">
              {[
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
                  href: 'https://everywak.kr/yourinfo',
                },
              ].map((app) => (
                <AppListItem size="small" {...app} />
              ))}
            </AsidePanel>
          </aside>
        </section>
        {/*<section className="news">
        <SectionHeader title="지금 왁타버스는" size="max" />
      </section>*/}
        <section className="apps">
          <SectionHeader title="여러가지가 있읍니다" size="max" />
          <Apps columns={3} />
        </section>
      </main>
    </div>
  );
}

function MobileFrontpage() {
  return (
    <div className="FrontPage mobile">
      <header>
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="headerWrapper">
          <div className="highlight">
            <LivePreview className="livePreview" channelId="woowakgood" size="big" hideProfile />
          </div>
          <div className="title">
            <Link to="/" className="title">
              <img src="/images/everywak_logo.png" alt="Everywak 로고" />
            </Link>
          </div>
        </div>
      </header>
      <div className="apps">
        <div className="appsWrapper">
          <FrontAppList />
        </div>
      </div>
      <div className="footer">
        <FrontWeatherPanel />
        {/*<nav>
        
      </nav>*/}
      </div>
    </div>
  );
}

export default Frontpage;
