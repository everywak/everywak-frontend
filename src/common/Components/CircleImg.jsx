import React, { Component } from 'react';
import styled, { css } from 'styled-components';

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
    
    const Image = styled.img`
      object-fit: ${['fill', 'contain', 'cover', 'none', 'scale-down'].includes(objectFit) ? objectFit : 'cover'};
      padding: ${padding}px;
    `;

    return (
      <div className="CircleImg" {...this.props}>
          <Image src={src} alt={alt} onError={e => {e.target.src = '/images/blank.png'}} />
      </div>
    );
  }
}

export default CircleImg;