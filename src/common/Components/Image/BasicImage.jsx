import React, { useState, useEffect } from 'react';

import BrokenImageRoundedIcon from '@material-ui/icons/BrokenImageRounded';

import * as func from '../../funtions';

import SkeletonLoader from '../SkeletonLoader';

import styles from './BasicImage.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const skeleton = 
  <div className="skeleton">
    <div className="skeletonItem">
    </div>
  </div>;
/**
 * 이미지
 * 
 * @param {{
 * className?: String, 
 * src: String, 
 * alt: String, 
 * noReferrer: Boolean,
 * objectFit: 'cover'|'contain', 
 * }} props 
 */
export default function BasicImage({ className = '', src, alt, noReferrer, objectFit = 'cover' }) {

  const [{isLoading, isError}, setState] = useState({
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    if (!src) {
      setState(prevValue => ({
        isLoading: false,
        isError: true,
      }));
    } else {
      setState(prevValue => ({
        isLoading: true,
        isError: false,
      }));
    }
  }, [src]);

  function onError(e) {
    setState(prevValue => ({
      isLoading: false,
      isError: true,
    }));
    e.target.src = '/images/blank.png';
  }

  function onLoad(e) {
    setTimeout(() => setState(prevValue => ({
      isLoading: false,
      isError: false,
    })), 50);
  }

  const imgStyle = {
    objectFit: (['fill', 'contain', 'cover', 'none', 'scale-down'].includes(objectFit) ? objectFit : 'cover'),
  }

  return (
    <div className={cx('BasicImage', className, {isLoading, isError})}>
      <img className="img" src={src} alt={alt} 
        onLoad={onLoad} 
        onError={onError} 
        referrerPolicy={noReferrer ? 'no-referrer' : 'strict-origin-when-cross-origin'} 
        style={imgStyle} 
      />
      <div className="errorIcon">
        <BrokenImageRoundedIcon fontSize="large" />
      </div>
      {isLoading && <SkeletonLoader skeleton={skeleton} length={1} />}
    </div>
  );
}