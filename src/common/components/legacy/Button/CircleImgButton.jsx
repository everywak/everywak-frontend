import React from 'react';

import LinkButton from './LinkButton';
import CircleImg from '../CircleImg';

import cx from 'classnames';

/**
 * 원 이미지 버튼
 *
 * @param {{
 * src: string,
 * alt?: string,
 * objectFit?: 'cover'|'contain',
 * padding?: number,
 * to?: string,
 * href?: string,
 * target?: string,
 * background?: string,
 * className?: string,
 * onClick?: function}} props
 */
function CircleImgButton(props) {
  const { src, alt, objectFit, padding, className, ...rest } = props;

  return (
    <LinkButton className={cx('CircleImgButton', className)} {...rest}>
      <CircleImg src={src} alt={alt} objectFit={objectFit} padding={padding} />
    </LinkButton>
  );
}

export default CircleImgButton;
