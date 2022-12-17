import React from 'react';

import BasicImage from '../../common/Components/Image/BasicImage';

import styles from './FrontWeatherItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * Frontpage에 표시되는 날씨 아이템
 * 
 * @param {{name: string, state: string, weather: string, isSkeleton: boolean}} props 
 * @returns {JSX.Element}
 */
function FrontWeatherItem({ name, state, weather, isSkeleton }) {
  
  return (
    <div className={cx('FrontWeatherItem', {skeleton: isSkeleton})}>
      <div className={cx('iconWrapper', {skeletonItem: isSkeleton})}>
        <BasicImage className="weatherImg" src={`https://ssl.gstatic.com/onebox/weather/64/${weather || 'fog'}.png`} noReferrer />
      </div>
      <div className="infoWrapper">
        <div className={cx('name', {skeletonItem: isSkeleton})}>{name}</div>
        <div className={cx('state', {skeletonItem: isSkeleton})}>{state}</div>
      </div>
    </div>
  );
}

export default FrontWeatherItem;