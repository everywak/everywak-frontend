import React, { Component } from 'react';

import * as func from '../../common/funtions';

import LivePreview from './LivePreview';
import FrontPanel from '../frontpage/FrontPanel';
import IsedolYoutubeList from './IsedolYoutubeList';
import IsedolClipList from './IsedolClipList';
import IsedolMemberList from './IsedolMemberList';

import styles from './Isedol.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Isedol() {
  
  return (
    <div className={cx('Isedol')}>
      <div className="contentWrapper">
        <section className="liveSection">
          <div className="logoArea">
            <img className="logoImg" src="/images/isedol/isedol_logo.png" alt="이세계 아이돌 로고"/>
            <ul className="social">
              <li className="socialItem waktube"></li>
              <li className="socialItem waktaverse"></li>
              <li className="socialItem wakmulwon"></li>
            </ul>
          </div>
          <IsedolLiveList />
        </section>
        <section className="youtubeSection">
          <FrontPanel data={{
            id: 'isedolpanel_youtube',
            title: "이세돌 유튜브",
            link: "/isedol/youtube",
            moreable: false,
            component: <IsedolYoutubeList />,
          }} />
        </section>
        <section className="clipSection">
          <FrontPanel data={{
            id: 'isedolpanel_clip',
            title: "이세돌 생방송 클립",
            link: "/isedol/clip",
            moreable: false,
            component: <IsedolClipList />,
          }} />
        </section>
        <div className="memberLine"></div>
        <section className="memberSection">
          <IsedolMemberList />
        </section>
      </div>
    </div>
  );
}

function IsedolLiveList() {

  const isedol = ['gosegugosegu','lilpaaaaaa','viichan6','vo_ine','cotton__123','jingburger'];
  const liveList = isedol.map(id => <LivePreview key={`livepanel_${id}`} channelId={id} />);
  
  return (
    <ul className="liveList">
      {liveList}
    </ul>
  );
}

export default Isedol;