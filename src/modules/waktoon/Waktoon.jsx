import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import CircleImg from '../../common/Components/CircleImg';
//import BasicButton from '../../common/Components/Button/BasicButton';
import LinkButton from '../../common/Components/Button/LinkButton';
import HorizontalScrollableList from '../../common/Components/HorizontalScrollableList/HorizontalScrollableList';

import FrontPanel from '../frontpage/FrontPanel';
import BasicSearchBar from '../../common/Components/SearchBar/BasicSearchBar';


import WaktoonBestList from './WaktoonBestList';
import WaktoonGeneralList from './WaktoonGeneralList';
import WaktoonChartList from './WaktoonChartList';

import * as func from '../../common/funtions';
import * as service from '../../services/Waktoon';
import * as userService from '../../services/Users';

import { aesEncrypt } from '../../common/crypto';

import styles from './Waktoon.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Waktoon(props) {
  func.setBrowserTitle('왁굳코믹스');

  return (
    <div className={cx('Waktoon')}>
      <div className="headerWrapper">
        <div className="headerContainer">
          <header>
            <h1 className="title">왁굳 코믹스<span className="beta">βeta</span></h1>
            <aside className="category">
              <ul className="categoryList">
                <li><Link to="/waktoon/best">베스트 웹툰</Link></li>
                <li><Link to="/waktoon/all">모든 웹툰</Link></li>
                {/*<li><Link to="/waktoon/video">영상툰</Link></li>*/}
                <li><a href="https://cafe.naver.com/ArticleList.nhn?search.clubid=27842958&search.menuid=548&search.boardtype=L" target="_blank">작가의 공간</a></li>
              </ul>
              {/*<EverywakLoginArea />*/}
            </aside>
          </header>
          <section className="highlight">
            <div className="intro">
              <h2 className="title">연재중인 베스트 왁툰</h2>
              <div className="description">우왁굳과 이세돌이 극찬한 작품들,<br/>바로 이곳 왁굳 코믹스에서 1화부터 정주행해봐요.</div>
              <Link to="/waktoon/best" className="btnMoreBest">
                더 보기 <KeyboardArrowRightRoundedIcon fontSize="small"/>
              </Link>
            </div>
            <div className="waktoonBestListWrapper">
              <HorizontalScrollableList backgroundColor="#fafafa" controlWidth={96} scrollAmount={400}>
                <WaktoonBestList />
              </HorizontalScrollableList>
            </div>
          </section>
        </div>
      </div>
      <div className="sectionWrapper">
        <section className="main">
          <FrontPanel data={{
            id: 'waktoonpanel_all',
            title: '모든 작품',
            link: '/waktoon/all',
            moreable: true,
            component: <WaktoonGeneralList />,
          }} />
        </section>
        <section className="side">
          <WaktoonSearchBar value="" searchTarget="title" onSearch={e => console.log(e)} />
          <FrontPanel data={{
            id: 'waktoonpanel_chart',
            title: '인기급상승 왁툰',
            link: '/waktoon/chart',
            moreable: true,
            component: <WaktoonChartList />,
          }} />
        </section>
      </div>
    </div>
  );
}

const searchOptions = [
  {
    name: '제목',
    value: 'title',
  },
  {
    name: '작가',
    value: 'author',
  },
];


async function getPopularWaktoonEpisodes() {
  
  try {
  
    const res = await service.getWaktoonEpisodeChart({ orderBy: 'up', perPage: 100 });
  
    if (res.status !== 200) { throw res; }
    
    const todayChart = res.result.waktoonEpisodeChartList;

    return todayChart;

  } catch(err) {
    console.error(err);
    return [];
  }
}

function WaktoonSearchBar(props) {

  const [placeholder, setPlaceholder] = useState('');
  const [popularKeywords, setPopularKeywords] = useState(['']);

  // 인기 왁툰 로드
  useEffect(() => {
    updatePopularWaktoonEpisodes();
  }, []);
  const updatePopularWaktoonEpisodes = useCallback(async () => {
    const todayChart = await getPopularWaktoonEpisodes();

    const list = todayChart.map(item => item.title);
    setPopularKeywords(prevValue => list);

    // 초기값
    const selectedId = parseInt(list.length * Math.random());
    setPlaceholder(list[selectedId]);

  }, []);

  // placeholder 순환 루프
  useEffect(() => {
    const loopPlaceholder = setInterval(updatePlaceholder, 10000);
    return () => clearInterval(loopPlaceholder);
  }, [popularKeywords]);

  const updatePlaceholder = useCallback(() => {
    const selectedId = parseInt(popularKeywords.length * Math.random());
    
    setPlaceholder(popularKeywords[selectedId]);
  }, [popularKeywords]);

  const _onSearch = useCallback(e => {
    props.onSearch({
      value: !e.value ? placeholder : e.value,
      searchTarget: e.searchTarget,
    });
  }, [placeholder]);

  const { onSearch, ...rest } = props;


  return <BasicSearchBar {...rest} placeholder={placeholder} searchTargetOptions={searchOptions} onSearch={_onSearch} />;
}

/**
 * @type {{logined: Boolean, userInfo: userService.EverywakUser}}
 */
const initialLoginAreaState = {
  logined: false,
  userInfo: null,
};
function EverywakLoginArea(props) {

  const [loginInfo, setLoginInfo] = useState(initialLoginAreaState);

  useEffect(() => {
    async function getWhoAmI() {
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
    }
    getWhoAmI();
  }, []);
  
  const csrfToken = func.getRandomString(10);
  const url = window.location.href.split('?')[0];
  const stateStr = csrfToken + aesEncrypt(csrfToken + url, csrfToken);

  return (
    <div className="EverywakLoginArea">
      {
        loginInfo.logined ? 
        <div className="userInfoWrapper">
          <CircleImg src={loginInfo.userInfo.profileImageUrl} />
        </div> :
        <LinkButton className="btnLogin"
          target="_self"
          href={`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_BACKEND_TWITCH_CLIENT_ID}&redirect_uri=https://api.everywak.kr/auth/twitch/login&scope=&state=${stateStr}`}>
          <PersonRoundedIcon fontSize="default"/> 로그인
        </LinkButton>
      }
    </div>
  )
}