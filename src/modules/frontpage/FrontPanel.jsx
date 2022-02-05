import React, { Component } from 'react';

import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import { Link } from 'react-router-dom';

import styles from './FrontPanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

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

export default FrontPanel;