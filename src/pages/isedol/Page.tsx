import React from 'react';
import clsx from 'clsx';

import Header from 'common/Header/Header';
import { Section } from 'common/components';
import CircleImgButton from 'common/components/legacy/Button/CircleImgButton';

import * as func from 'common/functions';

import { IsedolLiveList, IsedolMemberList } from 'components/isedol';

import styles from './Page.module.scss';
import { VideoContentList } from 'components/video';
import { SECONDS_OF_DAY } from 'common/constants';

export const Page = () => {
  func.setBrowserTitle('이세계아이돌');

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <section className={styles.liveSection}>
            <div className={styles.logoArea}>
              <img
                className={styles.logoImg}
                src="/images/isedol/isedol_logo.png"
                alt="이세계아이돌 로고"
              />
              <ul className={styles.social}>
                <li className={clsx(styles.socialItem, styles.waktube)}>
                  <CircleImgButton
                    src="/images/waktube_logo_2x.jpg"
                    background="white"
                    href={'https://www.youtube.com/user/woowakgood'}
                    alt="왁튜브"
                  />
                </li>
                <li className={clsx(styles.socialItem, styles.waktaverse)}>
                  <CircleImgButton
                    src="/images/wakent_logo_2x.png"
                    padding="5%"
                    background="black"
                    href={'https://www.youtube.com/c/welshcorgimessi'}
                    alt="왁타버스 유튜브 채널"
                  />
                </li>
                <li className={clsx(styles.socialItem, styles.wakmulwon)}>
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
          <Section
            className={styles.youtubeSection}
            title="이세돌 유튜브" /*moreLink="/isedol/youtube"*/
          >
            <VideoContentList
              className={styles.IsedolShortsList}
              options={{ type: 'youtubeVideo', twitchId: 'isedol' }}
            />
          </Section>
          <Section
            className={styles.clipSection}
            title="이세돌 주간 핫클립" /*moreLink="/isedol/clip"*/
          >
            <VideoContentList
              className={styles.IsedolShortsList}
              options={{
                type: 'youtubeClip',
                twitchId: 'isedol',
                orderBy: 'view',
                beginAt: Math.floor(Date.now() / 1000) - 7 * SECONDS_OF_DAY,
                endAt: Math.floor(Date.now() / 1000),
              }}
            />
          </Section>
          <Section
            className={styles.shortSection}
            title="이세돌 쇼츠" /*moreLink="/isedol/shorts"*/
          >
            <VideoContentList
              className={styles.IsedolShortsList}
              options={{ type: 'youtubeVideo', twitchId: 'isedol' }}
              shorts
              hideProfileCircle
              type="slide"
            />
          </Section>
          <div className={styles.memberLine}></div>
          <section className={styles.memberSection}>
            <IsedolMemberList />
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
