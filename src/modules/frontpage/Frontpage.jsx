import FrontPanel from './FrontPanel';
import Bestwakki from '../bestwakki/Bestwakki.js';
import Live from '../live/Live.js';
import Apps from '../apps/Apps.js';
import Etcs from '../apps/Etcs.js';

import * as func from '../../common/funtions';

import styles from './Frontpage.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Frontpage() {
  func.setBrowserTitle('메인');
  
  return (
    <div className="Frontpage">
      <FrontPanelList />
    </div>
  );
}

function FrontPanelList() {
  const data = [
    {
      id: 'front_live',
      title: "우왁굳 생방송",
      moreable: true,
      link: "/live",
      component: <Live front={true} />
    },
    {
      id: 'front_bestwakki',
      title: "왁물원 인기글",
      moreable: true,
      link: "/bestwakki",
      component: <Bestwakki front={true} />
    },
    {
      id: 'front_apps',
      title: "여러가지가 있읍니다",
      moreable: false,
      component: <Apps front={true} />
    },
    {
      id: 'front_etcs',
      title: "딱히.. 팬치쿤이 봐줬으면 하는 건 아니고.... ",
      moreable: false,
      component: <Etcs front={true} />
    },
  ];

  const list = data.map(
    data => <FrontPanel key={data.id} data={data} />
  );

  return (
    <ul className="FrontPanelList">
      {list}
    </ul>
  );
}

export default Frontpage;