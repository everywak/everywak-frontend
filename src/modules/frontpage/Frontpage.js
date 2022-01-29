import React, { Component } from 'react';
import styles from './Frontpage.scss';
import classNames from 'classnames/bind';

import Bestwakki from '../bestwakki/Bestwakki.js';
import Live from '../live/Live.js';
import Apps from '../apps/Apps.js';
import Etcs from '../apps/Etcs.js';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

class Frontpage extends Component {

  render() {
    
    return (
      <div className="Frontpage">
        <FrontPanelList />
      </div>
    );
  }
}

class FrontPanelList extends Component {
  static defaultProps = {
    data: [
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
    ]
  }

  render() {
    const { data } = this.props;
    const list = data.map(
      data => <FrontPanel key={data.id} data={data} />
    );

    return (
      <ul className="FrontPanelList">
        {list}
      </ul>
    );
  }
}

class FrontPanel extends Component {
  static defaultProps = {
    data: {
      id: 'front_default',
      title: "모듈",
      link: "/",
      moreable: true,
      component: null
    }
  };

  render() {
    const { 
      link, title, component, moreable
    } = this.props.data;
    return (
      <li className="FrontPanel">
        <section className="panelHeader">
          {
            moreable ?
            <Link to={link}>
              <span className="tit">{title}</span>
              <span className="more">
                더 보기 <KeyboardArrowRightRoundedIcon fontSize="small"/>
              </span>
            </Link> :
            <a>
              <span className="tit">{title}</span>
            </a>
          }
        </section>
        <div className="compContainer">
          {component}
        </div>
      </li>
    );
  }
}

export default Frontpage;