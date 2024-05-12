import React from 'react';

import BasicImage from '../../common/Components/Image/BasicImage';

import './PrevWeatherItem.scss';
import cx from 'classnames';

/**
 * 최근 날씨 아이템
 * 
 * @param {{name: string, state: string, description: string, weather: string, isSkeleton: boolean}} props 
 * @returns {JSX.Element}
 */
function PrevWeatherItem({ name, state, description, weather, isSkeleton }) {
  
  return (
    <div className={cx('PrevWeatherItem', {skeleton: isSkeleton})}>
      <div className={cx('iconWrapper', {skeletonItem: isSkeleton})}>
        <BasicImage className="weatherImg" src={`https://ssl.gstatic.com/onebox/weather/128/${weather || 'fog'}.png`} noReferrer />
      </div>
    </div>
  );
}

export default PrevWeatherItem;