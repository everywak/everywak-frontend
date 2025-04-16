import React from 'react';

import { personalColor } from './weather.common';

import BasicImage from 'common/components/legacy/Image/BasicImage';

import './TodayWeatherItem.scss';
import cx from 'classnames';

/**
 * 날씨 페이지 오늘 날씨 아이템
 *
 * @param {{name: string, state: string, description: string, weather: string, isSkeleton: boolean}} props
 * @returns {JSX.Element}
 */
function TodayWeatherItem({ name = 'null', state, description = '', weather, isSkeleton }) {
  const color = name !== 'null' ? { '--color': `var(--color-${personalColor[name]})` } : {};

  return (
    <div className={cx('TodayWeatherItem', { skeleton: isSkeleton })}>
      <div className="nameWrapper">
        <div className="personalColorPoint" style={color}></div>
        <div className={cx('name', { skeletonItem: isSkeleton })}>{name}</div>
      </div>
      <div className="infoWrapper">
        <div className={cx('iconWrapper', { skeletonItem: isSkeleton })}>
          <BasicImage
            className="weatherImg"
            src={`https://ssl.gstatic.com/onebox/weather/128/${weather || 'fog'}.png`}
            noReferrer
          />
        </div>
        <div className="descWrapper">
          <div className={cx('state', { skeletonItem: isSkeleton })}>{state}</div>
          {description && (
            <div className={cx('description', { skeletonItem: isSkeleton })}>
              {description
                .split('\n')
                .map((line) => `"${line}"`)
                .join('\n')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodayWeatherItem;
