import React, { Component } from 'react';
import styles from './Frontpage.scss';
import classNames from 'classnames/bind';

import Bestwakki from '../bestwakki/Bestwakki.js';
import Live from '../live/Live.js';
import Apps from '../apps/Apps.js';
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
        id: 0,
        title: "우왁굳 생방송",
        link: "/live",
        component: <Live front={true} />
      },
      {
        id: 1,
        title: "왁물원 인기글",
        link: "/bestwakki",
        component: <Bestwakki front={true} />
      },
      {
        id: 2,
        title: "여러가지가 있읍니다",
        link: "/apps",
        component: <Apps front={true} />
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
      id: -1,
      title: "모듈",
      link: "/",
      component: null
    }
  };

  render() {
    const { 
      link, title, component
    } = this.props.data;
    return (
      <li className="FrontPanel">
        <section className="panelHeader">
          <Link to={link}>
            <span className="tit">{title}</span>
            <span className="more">
              더 보기 <KeyboardArrowRightRoundedIcon fontSize="small"/>
            </span>
          </Link>
        </section>
        <div className="compContainer">
          {component}
        </div>
      </li>
    );
  }
}

export default Frontpage;