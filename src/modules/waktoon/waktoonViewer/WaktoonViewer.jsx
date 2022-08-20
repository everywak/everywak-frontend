import React, { useState, useEffect } from 'react';
import { Route, Switch, Link, useParams } from 'react-router-dom';

import CheckBox from '../../../common/Components/CheckBox/CheckBox';
import BasicImage from '../../../common/Components/Image/BasicImage';
import BasicButton from '../../../common/Components/Button/BasicButton';
import LinkButton from '../../../common/Components/Button/LinkButton';
import CircleImg from '../../../common/Components/CircleImg';

import BasicSearchBar from '../../../common/Components/SearchBar/BasicSearchBar';
import BasicSelect from '../../../common/Components/Select/BasicSelect';

import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import CommentRoundedIcon from '@material-ui/icons/CommentRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
import NotificationsNoneRoundedIcon from '@material-ui/icons/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';

import * as func from '../../../common/funtions';
import * as service from '../../../services/Waktoon';
import * as userService from '../../../services/Users';

import useInputs from '../../../hooks/useInputs';

import WaktoonEpisodeList from './WaktoonEpisodeList';

import styles from './WaktoonViewer.scss';
import classNames from 'classnames/bind';
import SkeletonLoader from '../../../common/Components/SkeletonLoader';
const cx = classNames.bind(styles);

export default function WaktoonViewer({location, history}) {

  const [target, setTarget] = useState({ isLoading: true });

  const { toonId, episodeNumber } = useParams();

  useEffect(() => {
    async function fetchWaktoonData() {
      const { waktoonList } = (await service.getWaktoons({ queryTarget: 'uuid', queryTxt: toonId })).result;
      if (!waktoonList) {
        setTarget({});
      } else {
        setTarget(waktoonList[0]);
      }
    }
    fetchWaktoonData();
  }, [toonId]);


  return (
    <div className={cx('WaktoonViewer')}>
      <div className="headerWrapper">
        <header>
          <Link className="btnBackToPage" onClick={e => history.goBack()}>
            <KeyboardArrowLeftRoundedIcon fontSize="medium"/> 목록으로
          </Link>
          <div className="infoWrapper">
            <WaktoonInfo waktoon={target} />
            <div className="statList">
              <CounterButton IconEnabled={StarRoundedIcon} IconDisabled={StarOutlineRoundedIcon} label="즐겨찾기" value={false} onClick={null} />
              <CounterButton IconEnabled={NotificationsActiveRoundedIcon} IconDisabled={NotificationsNoneRoundedIcon} label="신작 알림" value={false} onClick={null} />
              <div className="line"></div>
              <StatCounter waktoon={target} type="view" />
              <StatCounter waktoon={target} type="up" />
              <StatCounter waktoon={target} type="comment" />
            </div>
          </div>
        </header>
      </div>
      <section className="content">
        <Switch>
          <Route path="/waktoon/:toonId/episode/:episodeNumber" children={<WaktoonEpisodeSlider parent={target} />}/>
          <Route path="/waktoon/:toonId" children={<WaktoonEpisodeListWrapper target={target} />} />
        </Switch>
      </section>
    </div>
  );
}

const waktoonInfoSkeleton = 
<div className="WaktoonInfo skeleton">
  <div className="thumbnailWrapper skeletonItem"></div>
  <div className="infoArea">
    <div className="summary">
      <span className="ended"><span className="skeletonItem">aaaaaa</span></span>
      <h1 className="title"><span className="skeletonItem">aaaaaaaaaaaaaa</span></h1>
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
</div>;

function WaktoonInfo({ waktoon }) {

  const [loginInfo, setLoginInfo] = useState({
    logined: false,
    userInfo: null,
  });

  const serialStatusLabel = {
    continuing: '연재중',
    paused: '휴재',
    ended: '완결'
  }

  useEffect(async () => {
    const resUserInfo = await userService.getWhoAmI();
    console.log(resUserInfo)
    if (resUserInfo.status === 200) {
      if (resUserInfo.result.logined && resUserInfo.result.joined) {
        setLoginInfo(loginInfo => ({
          logined: true,
          userInfo: resUserInfo.result.userInfo,
        }));
      } else {
        setLoginInfo(loginInfo => ({
          logined: false,
          userInfo: null,
        }));
      }
    }
  }, []);

  return !waktoon.isLoading && waktoon ? (
    <div className="WaktoonInfo">
      <div className="thumbnailWrapper">
        <BasicImage src={waktoon.thumbnails && waktoon.thumbnails.replace('100_100', '200_200')} alt={waktoon.title + ' 표지'} noReferrer />
      </div>
      <div className="infoArea">
        <div className="summary">
          <span className="ended">{serialStatusLabel[waktoon.serialStatus || 'continuing']}</span>
          <h1 className="title">
            {waktoon.title}
            {
              loginInfo.logined && loginInfo.userInfo.userId == '156535358' && 
              <LinkButton className="btnEdit" to={`/waktoon/${waktoon.uuid}/edit`}>
                <SettingsRoundedIcon fontSize="default" />
              </LinkButton>
            }
          </h1>
          <div className="authorArea">
            <Link className="author">
              <CircleImg className="authorProfile" src={''} alt="작가 프로필 이미지" />
              <span className="authorNickname">{waktoon.authorNickname}</span>
            </Link>
            <span>·</span>
            <Link to="" className="btnMoreWaktoon">이 작가의 다른 만화 보기</Link>
          </div>
        </div>
        <div className="description">{waktoon.description}</div>
      </div>
    </div>
  ) : ( // loading skeleton
    <SkeletonLoader skeleton={waktoonInfoSkeleton} length={1} />
  )
}

const statIcon = {
  view: <VisibilityRoundedIcon fontSize="medium" />,
  up: <FavoriteRoundedIcon fontSize="medium" />,
  comment: <CommentRoundedIcon fontSize="medium" />,
}
function formatCount(value) {
  if (value > 999 && value < 10000) {
    return `${parseInt(value / 100) / 10}천`;
  } else if (value >= 10000) {
    return `${parseInt(value / 1000) / 10}만`;
  } else {
    return value;
  }
}
function StatCounter ({ waktoon, type }) {

  return (
    <div className={cx('StatCounter', type)}>
      <div className="icon">{statIcon[type]}</div>
      <span className="label">{formatCount(waktoon[type + 'Count'])}</span>
    </div>
  )
}
function CounterButton ({ IconEnabled, IconDisabled, label, value, onClick }) {

  return (
    <button className="CounterButton" onClick={onClick}>
      <div className="icon">{value ? <IconEnabled fontSize="medium" /> : <IconDisabled fontSize="medium" />}</div>
      <span className="label">{label}</span>
    </button>
  )
}

const episodeItemSkeleton = <li className={cx('WaktoonItem', 'episode', 'skeleton')}>
  <a>
    <div className="previewWrapper skeletonItem"></div>
    <div className="infoArea">
      <div className="descArea">
        <div className="title"><span className="skeletonItem">asdfasdf</span></div>
        <div className="publishedTime"><span className="skeletonItem">asdfa</span></div>
      </div>
    </div>
  </a>
</li>;
function WaktoonEpisodeListWrapper({ target }) {
  
  const [searchOptions, onChange, reset] = useInputs({orderBy: 'time', keyword: ''});
  
  return (<>
    <div className="waktoonEpisodeListHeader">
      <div className="sortArea">
        <BasicButton className="btnViewFirst"><MenuBookRoundedIcon />1화부터 보기</BasicButton>
        <BasicSelect options={[{name: '최신 화부터', value: 'time'}, {name: '첫 화부터', value: 'time_oldest'}]} name="orderBy" value={searchOptions.orderBy} onChange={onChange} />
      </div>
      <BasicSearchBar placeholder="에피소드 검색" onSearch={({ value }) => onChange({target: {name: 'keyword', value: value}})} />
    </div>
    {
      target.isLoading ?
      <div className={cx('WaktoonList', 'WaktoonEpisodeList')}>
        <ul className="itemList">
          <SkeletonLoader skeleton={episodeItemSkeleton} length={8} />
        </ul>
      </div> :
      <WaktoonEpisodeList toonTitle={target.title} uuid={target.uuid} searchOptions={searchOptions} onChange={() => {}} />
    }
  </>);
}


function WaktoonEpisodeSlider({ parent }) {

  const [autoRedirect, setAutoRedirect] = useState(true);

  const { toonId, episodeNumber } = useParams();
  
  return (<div className="WaktoonEpisodeSlider">
    <div className="sliderHeader">
      <BasicButton className="btnBackToList"><MenuBookRoundedIcon />에피소드 목록</BasicButton>
      <CheckBox label="다음/이전화 클릭시 자동으로 링크 열기" name='autoRedirect' value={true} onChange={e => {}} />
    </div>
    <div className="slider">
      <WaktoonEpisodeViewItem target={{
        toonId: '12345678', 
        thumbnail: '',
        title: '이전 에피소드',
        episodeNumber: '1',
        onClick: () => {},
      }} side />
      <WaktoonEpisodeViewItem target={{
        toonId: '12345678', 
        thumbnail: '',
        title: '이번 에피소드',
        episodeNumber: '2',
        onClick: () => {},
      }} />
      <WaktoonEpisodeViewItem target={{
        toonId: '12345678', 
        thumbnail: '',
        title: '다음 에피소드',
        episodeNumber: '3',
        onClick: () => {},
      }} side />
    </div>
  </div>);
}

function WaktoonEpisodeViewItem({ target, side = false }) {

  return (
    <div className={cx('WaktoonEpisodeViewItem', {side: side})}>
      <div className="title">{target.title}</div>
      <CoverImg src={target.thumbnail} alt="썸네일"></CoverImg>
      <div className="caption"><KeyboardArrowUpRoundedIcon fontSize="small" />클릭해서 감상</div>
    </div>
  );
}

function CoverImg({ src, alt, children }) {

  return (
    <div className="CoverImg">
      <img className="img" src={src} alt={alt} onError={e => {e.target.src = '/images/blank.png'}} referrerPolicy="no-referrer" />
      <div className="overlayWrapper">
        {children}
      </div>
    </div>
  );
}