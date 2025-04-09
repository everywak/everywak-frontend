import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import * as clipApi from 'services/Clip';
import * as everywakApi from 'services/everywak-api/index';
import * as func from 'common/functions';
import { Waktaverse } from 'common/constants';
import { Desktop, NotDesktop } from 'common/MediaQuery';

import Header from 'common/Header/Header';
import CircleImg from 'common/components/legacy/CircleImg';
import { Section } from 'common/components';

import RecommendClipList from './RecommendClipList';

import './VideoWatch.scss';
import cx from 'classnames';

/**
 * 클립 페이지
 *
 * @param {{}} props
 * @returns {JSX.Element}
 */
function VideoWatch(props) {
  const [isLoading, setLoading] = useState(true);
  const [clipInfo, setClipInfo] = useState(
    /** @type {clipApi.ClipInfoItem} */ {
      type: 'none',
      nickname: '닉네임',
      twitchId: '',
      youtubeId: '',
      videoId: '',
      title: '',
      publishedAt: 0,
      description: '',
      thumbnails: {},
      viewCount: 0,
      duration: 0,
      creatorId: '',
      creatorName: '',
      profileImg: '',
      targetUser: null,
    },
  );
  const { videoId } = useParams();

  const sessionId = 'PAuXpMrzwszlAqaYBiTEYeSUtDWjHxua';

  const fetchClipInfo = async (videoId) => {
    const response = await clipApi.getClipInfo(videoId);

    if (response.result.items) {
      const clipData = response.result.items[0];

      const waktaverseInfo = (await everywakApi.live.getWaktaverseInfo()).message.result;
      const targetInfo = waktaverseInfo?.find((item) => item.twitchLoginName === clipData.twitchId);
      if (targetInfo) {
        clipData.profileImg = targetInfo.twitchProfileImage;
        clipData.targetUser = Waktaverse.find((item) => item.login_name === clipData.twitchId);
      }

      setClipInfo(clipData);
      setLoading(false);
      func.setBrowserTitle(`클립 - ${clipData.title}`);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchClipInfo(videoId);
  }, [videoId]);

  const videoUrl =
    clipInfo && `https://api.everywak.kr/clip/media/${clipInfo.videoId}?session_id=${sessionId}`;

  return (
    <>
      <Header />
      <div className="VideoWatch">
        <div className="contentWrapper">
          <div className="headerWrapper">
            {/*
          <div className="searchBarWrapper">
            <Link to="/">
              <ArchiveRoundedIcon />
              왁굳TV
            </Link>
            <BasicSearchBar />
          </div>
        */}
          </div>
          <NotDesktop>
            <VideoContentPlayer src={videoUrl} isLoading={isLoading} />
          </NotDesktop>
          <div className="twoColumns">
            <main>
              <Desktop>
                <VideoContentPlayer src={videoUrl} isLoading={isLoading} />
              </Desktop>
              <div className="videoInfo">
                <div className="info">
                  <div className="title">{clipInfo.title}</div>
                  <div className="desc">
                    <CircleImg className="profileImg" src={clipInfo.profileImg} />
                    <div className="social">
                      <div className="nickname">{clipInfo.nickname}</div>
                      {clipInfo.targetUser && (
                        <div className="links">
                          <a
                            className="btnLink"
                            href={
                              clipInfo.targetUser &&
                              `https://www.youtube.com/channel/${clipInfo.targetUser.youtube.channelId}`
                            }
                          >
                            유튜브
                          </a>
                          {clipInfo.targetUser.youtube.clipId && (
                            <a
                              className="btnLink"
                              href={
                                clipInfo.targetUser &&
                                `https://www.youtube.com/channel/${clipInfo.targetUser.youtube.clipId}`
                              }
                            >
                              클립
                            </a>
                          )}
                          {clipInfo.targetUser.youtube.replayId && (
                            <a
                              className="btnLink"
                              href={
                                clipInfo.targetUser &&
                                `https://www.youtube.com/channel/${clipInfo.targetUser.youtube.replayId}`
                              }
                            >
                              다시보기
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="stat"></div>
              </div>
              <div className="descriptionWrapper">
                <div className="statText">
                  조회수 {func.formatNumberShort(clipInfo.viewCount)}회{' '}
                  {!isLoading && func.formatDateTimeString(new Date(clipInfo.publishedAt * 1000))}
                </div>
                <div className="description">
                  {!isLoading && clipInfo.type === 'twitchClip'
                    ? `클립 생성한 사람: ${clipInfo.creatorName}`
                    : clipInfo.description}
                </div>
              </div>
            </main>
            <aside>
              <Section title="관련 클립">
                <RecommendClipList clipInfo={clipInfo} />
              </Section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

function VideoContentPlayer({ className, src, isLoading = true }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!isLoading) {
      videoRef.current?.load();
    }
  }, [src, isLoading]);

  return (
    <>
      {isLoading ? (
        <div className="player skeleton"></div>
      ) : (
        <video ref={videoRef} className={cx('player', className)} controls loop autoPlay={true}>
          <source src={src} type="video/mp4" />
        </video>
      )}
    </>
  );
}

export default VideoWatch;
