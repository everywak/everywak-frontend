import styled, { css } from 'styled-components';

import styles from './CircleImg.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 원 모양 이미지
 * 
 * @param {{src: string, alt?: string, objectFit: 'cover'|'contain', padding: number, ...props}} props 
 */
function CircleImg({className, src, alt, objectFit = 'cover', padding = 0, ...props}) {
  
  const Image = styled.img`
    object-fit: ${['fill', 'contain', 'cover', 'none', 'scale-down'].includes(objectFit) ? objectFit : 'cover'};
    padding: ${padding}px;
  `;

  return (
    <div className={cx('CircleImg', ...className)} {...props}>
        <Image src={src} alt={alt} onError={e => {e.target.src = '/images/blank.png'}} />
    </div>
  );

}

export default CircleImg;