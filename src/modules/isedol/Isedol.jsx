import React from 'react';

import Header from 'common/Header/Header';
import { Section } from 'common/components';
import CircleImgButton from 'common/components/legacy/Button/CircleImgButton';

import * as func from '../../common/functions';

import LivePreview from './LivePreview';
import IsedolYoutubeList from './IsedolYoutubeList';
import IsedolClipList from './IsedolClipList';
import VideoContentList from './VideoContentList';
import IsedolMemberList from './IsedolMemberList';

import './Isedol.scss';
import cx from 'classnames';

function Isedol() {
  func.setBrowserTitle('이세계아이돌');

  return (
    <>
      <Header />
      <div className={cx('Isedol')}>
        <div className="contentWrapper">
          <section className="liveSection">
            <div className="logoArea">
              <img
                className="logoImg"
                src="/images/isedol/isedol_logo.png"
                alt="이세계아이돌 로고"
              />
              <ul className="social">
                <li className="socialItem waktube">
                  <CircleImgButton
                    src="/images/waktube_logo_2x.jpg"
                    background="white"
                    href={'https://www.youtube.com/user/woowakgood'}
                    alt="왁튜브"
                  />
                </li>
                <li className="socialItem waktaverse">
                  <CircleImgButton
                    src="/images/wakent_logo_2x.png"
                    padding="5%"
                    background="black"
                    href={'https://www.youtube.com/c/welshcorgimessi'}
                    alt="왁타버스 유튜브 채널"
                  />
                </li>
                <li className="socialItem wakmulwon">
                  <CircleImgButton
                    src="/images/wakki_logo_2x.png"
                    padding="23%"
                    background="#5ac467"
                    href={'https://cafe.naver.com/steamindiegame'}
                    alt="왁물원"
                  />
                </li>
              </ul>
            </div>
            <IsedolLiveList />
          </section>
          <Section className="youtubeSection" title="이세돌 유튜브" /*moreLink="/isedol/youtube"*/>
            <IsedolYoutubeList />
          </Section>
          <Section className="clipSection" title="이세돌 주간 핫클립" /*moreLink="/isedol/clip"*/>
            <IsedolClipList />
          </Section>
          <Section className="shortSection" title="이세돌 쇼츠" /*moreLink="/isedol/shorts"*/>
            <VideoContentList
              className="IsedolShortsList"
              options={{ type: 'youtubeVideo', twitchId: 'isedol' }}
              shorts
              hideProfileCircle
            />
          </Section>
          <div className="memberLine"></div>
          <section className="memberSection">
            <IsedolMemberList />
          </section>
        </div>
      </div>
    </>
  );
}

function IsedolLiveList() {
  const isedol = ['vo_ine', 'jingburger', 'lilpaaaaaa', 'cotton__123', 'gosegugosegu', 'viichan6'];
  const liveList = isedol.map((id) => <LivePreview key={`livepanel_${id}`} channelId={id} />);

  return <ul className="liveList">{liveList}</ul>;
}

export default Isedol;
