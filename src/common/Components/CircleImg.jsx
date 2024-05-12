import React from 'react';

import styled from '@emotion/styled';

import styles from './CircleImg.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const Image = styled.img`
object-fit: ${props => (['fill', 'contain', 'cover', 'none', 'scale-down'].includes(props.objectFit) ? props.objectFit : 'cover')};
padding: ${props => props.padding};
`;

/**
 * 원 모양 이미지
 * 
 * @param {{src: string, alt?: string, objectFit: 'cover'|'contain', padding: number}} props 
 */
function CircleImg(props) {
  const {
    className, 
    src, 
    alt, 
    objectFit = 'cover', 
    padding = 0,
    ...rest
  } = props;

  return (
    <div className={cx('CircleImg', className)} {...rest}>
      <Image src={src} alt={alt} objectFit={objectFit} padding={padding} draggable="false" onError={e => {e.target.src = '/images/blank.png'}} />
    </div>
  );

}

export default CircleImg;