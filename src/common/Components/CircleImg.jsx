import React, { Component } from 'react';

import styles from './CircleImg.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class CircleImg extends Component {
  static defaultProps = {
    src: '',
    alt: '',
    objectFit: 'cover', // cover | contain
    padding: 0,
  }
  
  render() {
    const { src, alt, objectFit, padding } = this.props;

    return (
      <div className="CircleImg" {...this.props}>
          <img src={src} alt={alt} onError={e => {e.target.src = '/images/blank.png'}} style={{objectFit: objectFit, padding: `${padding}px`}} />
      </div>
    );
  }
}

export default CircleImg;