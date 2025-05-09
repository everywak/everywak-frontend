import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import BasicImage from 'common/components/legacy/Image/BasicImage';
import BasicButton from 'common/components/legacy/Button/BasicButton';
import LinkButton from 'common/components/legacy/Button/LinkButton';
import CircleImg from 'common/components/legacy/CircleImg';

import BasicSearchBar from 'common/components/legacy/SearchBar/BasicSearchBar';
import { Header, Footer, Select } from 'common/components';
import SkeletonLoader from 'common/components/legacy/SkeletonLoader';

import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import * as func from 'common/functions';
import * as service from 'services/Waktoon';
import * as userService from 'services/Users';

import { useInputs } from 'hooks/useInputs';

import BackButton from '../BackButton';
import WaktoonEpisodeList from './WaktoonEpisodeList';

import './WaktoonViewer.scss';
import cx from 'classnames/bind';

export default function WaktoonViewer() {
  const [target, setTarget] = useState({ isLoading: true });

  const { toonId, episodeNumber } = useParams();

  useEffect(() => {
    async function fetchWaktoonData() {
      const { waktoonList } = (await service.getWaktoons({ queryTarget: 'uuid', queryTxt: toonId }))
        .result;
      if (!waktoonList) {
        setTarget({});
      } else {
        setTarget(waktoonList[0]);
        func.setBrowserTitle(`왁굳코믹스 - ${waktoonList[0].title}`);
      }
    }
    fetchWaktoonData();
  }, [toonId]);

  return (
    <>
      <Header />
      <div className={cx('WaktoonViewer')}>
        <div className="headerWrapper">
          <header>
            <BackButton />
            <div className="infoWrapper">
              <WaktoonInfo waktoon={target} />
              <div className="statList">
                <div className="counterWrapper">
                  <CounterButton
                    IconEnabled={StarRoundedIcon}
                    IconDisabled={StarOutlineRoundedIcon}
                    label="즐겨찾기"
                    value={false}
                    onClick={null}
                  />
                  <CounterButton
                    IconEnabled={NotificationsActiveRoundedIcon}
                    IconDisabled={NotificationsNoneRoundedIcon}
                    label="신작 알림"
                    value={false}
                    onClick={null}
                  />
                </div>
                <div className="line"></div>
                <div className="counterWrapper">
                  <StatCounter waktoon={target} type="view" />
                  <StatCounter waktoon={target} type="up" />
                  <StatCounter waktoon={target} type="comment" />
                </div>
              </div>
            </div>
          </header>
        </div>
        <section className="content">
          {/* <Routes> */}
          {/* <Route path="/waktoon/:toonId/episode/:episodeNumber" element={<WaktoonEpisodeSlider parent={target} />}/> */}
          <WaktoonEpisodeListWrapper target={target} />
          {/* </Routes> */}
        </section>
      </div>
      <Footer />
    </>
  );
}

const waktoonInfoSkeleton = (
  <div className="WaktoonInfo skeleton">
    <div className="thumbnailWrapper skeletonItem"></div>
    <div className="infoArea">
      <div className="summary">
        <span className="ended">
          <span className="skeletonItem">aaaaaa</span>
        </span>
        <h1 className="title">
          <span className="skeletonItem">aaaaaaaaaaaaaa</span>
        </h1>
        <div className="authorArea">
          <a className="author">
            <div className="authorProfileSkeleton skeletonItem" />
            <span className="authorNickname skeletonItem">aaaaaaa</span>
          </a>
        </div>
      </div>
      <div className="description skeletonItem">a</div>
      <div className="description skeletonItem">a</div>
      <div className="description last skeletonItem">aaaaaaa aaaaaaaaaaa</div>
    </div>
  </div>
);

function WaktoonInfo({ waktoon }) {
  const [loginInfo, setLoginInfo] = useState({
    logined: false,
    userInfo: null,
  });

  const serialStatusLabel = {
    continuing: '연재중',
    paused: '휴재',
    ended: '완결',
  };

  useEffect(() => {
    async function fetch() {
      const resUserInfo = await userService.getWhoAmI();
      console.log(resUserInfo);
      if (resUserInfo.status === 200) {
        if (resUserInfo.result.logined && resUserInfo.result.joined) {
          setLoginInfo((loginInfo) => ({
            logined: true,
            userInfo: resUserInfo.result.userInfo,
          }));
        } else {
          setLoginInfo((loginInfo) => ({
            logined: false,
            userInfo: null,
          }));
        }
      }
    }
    fetch();
  }, []);

  return !waktoon.isLoading && waktoon ? (
    <div className="WaktoonInfo">
      <div className="thumbnailWrapper">
        <BasicImage
          src={waktoon.thumbnails && waktoon.thumbnails.replace('100_100', '200_200')}
          alt={waktoon.title + ' 표지'}
          noReferrer
        />
      </div>
      <div className="infoArea">
        <div className="summary">
          <span className="ended">{serialStatusLabel[waktoon.serialStatus || 'continuing']}</span>
          <h1 className="title">
            {waktoon.title}
            {loginInfo.logined && loginInfo.userInfo.userId == '156535358' && (
              <LinkButton className="btnEdit" to={`/waktoon/${waktoon.uuid}/edit`}>
                <SettingsRoundedIcon fontSize="default" />
              </LinkButton>
            )}
          </h1>
          <div className="authorArea">
            <Link className="author">
              <CircleImg className="authorProfile" src={''} alt="작가 프로필 이미지" />
              <span className="authorNickname">{waktoon.authorNickname}</span>
            </Link>
            <span>·</span>
            <Link to="" className="btnMoreWaktoon">
              이 작가의 다른 만화 보기
            </Link>
          </div>
        </div>
        <div className="description">{waktoon.description}</div>
      </div>
    </div>
  ) : (
    // loading skeleton
    <SkeletonLoader skeleton={waktoonInfoSkeleton} length={1} />
  );
}

const statIcon = {
  view: <VisibilityRoundedIcon fontSize="medium" />,
  up: <FavoriteRoundedIcon fontSize="medium" />,
  comment: <CommentRoundedIcon fontSize="medium" />,
};
function formatCount(value) {
  if (value > 999 && value < 10000) {
    return `${parseInt(value / 100) / 10}천`;
  } else if (value >= 10000) {
    return `${parseInt(value / 1000) / 10}만`;
  } else {
    return value;
  }
}
function StatCounter({ waktoon, type }) {
  return (
    <div className={cx('StatCounter', type)}>
      <div className="icon">{statIcon[type]}</div>
      <span className="label">{formatCount(waktoon[type + 'Count'])}</span>
    </div>
  );
}
function CounterButton({ IconEnabled, IconDisabled, label, value, onClick }) {
  return (
    <button className="CounterButton" onClick={onClick}>
      <div className="icon">
        {value ? <IconEnabled fontSize="medium" /> : <IconDisabled fontSize="medium" />}
      </div>
      <span className="label">{label}</span>
    </button>
  );
}

const episodeItemSkeleton = (
  <li className={cx('WaktoonItem', 'episode', 'skeleton')}>
    <a>
      <div className="previewWrapper skeletonItem"></div>
      <div className="infoArea">
        <div className="descArea">
          <div className="title">
            <span className="skeletonItem">asdfasdf</span>
          </div>
          <div className="publishedTime">
            <span className="skeletonItem">asdfa</span>
          </div>
        </div>
      </div>
    </a>
  </li>
);
function WaktoonEpisodeListWrapper({ target }) {
  console.log('asdflkasjhdfkajshdflkasjdhflkasjdhflsa');

  const [searchOptions, onChange, reset] = useInputs({ orderBy: 'time', keyword: '' });

  return (
    <>
      <div className="waktoonEpisodeListHeader">
        <div className="sortArea">
          <BasicButton className="btnViewFirst">
            <MenuBookRoundedIcon />
            1화부터 보기
          </BasicButton>
          <Select
            options={[
              { name: '최신 화부터', value: 'time' },
              { name: '첫 화부터', value: 'time_oldest' },
            ]}
            name="orderBy"
            value={searchOptions.orderBy}
            onChange={onChange}
          />
        </div>
        <BasicSearchBar
          placeholder="에피소드 검색"
          onSearch={({ value }) => onChange({ target: { name: 'keyword', value: value } })}
        />
      </div>
      {target.isLoading ? (
        <div className={cx('WaktoonList', 'WaktoonEpisodeList')}>
          <ul className="itemList">
            <SkeletonLoader skeleton={episodeItemSkeleton} length={8} />
          </ul>
        </div>
      ) : (
        <WaktoonEpisodeList
          viewType="list"
          toonTitle={target.title}
          uuid={target.uuid}
          searchOptions={searchOptions}
          onChange={() => {}}
        />
      )}
    </>
  );
}

function CoverImg({ src, alt, children }) {
  return (
    <div className="CoverImg">
      <img
        className="img"
        src={src}
        alt={alt}
        onError={(e) => {
          e.target.src = '/images/blank.png';
        }}
        referrerPolicy="no-referrer"
      />
      <div className="overlayWrapper">{children}</div>
    </div>
  );
}
