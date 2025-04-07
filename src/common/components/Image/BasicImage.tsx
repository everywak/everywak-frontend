import { useState, useEffect } from 'react';
import clsx from 'clsx';

import BrokenImageRoundedIcon from '@mui/icons-material/BrokenImageRounded';

import SkeletonLoader from 'common/Components/SkeletonLoader';
import styles from './BasicImage.module.scss';

export interface Props {
  className?: string;
  src: string;
  alt: string;
  noReferrer?: boolean;
  objectFit?: 'cover' | 'contain';
}

const skeleton = (
  <div className="skeleton">
    <div className="skeletonItem"></div>
  </div>
);

export function BasicImage({ className = '', src, alt, noReferrer, objectFit = 'cover' }: Props) {
  const [{ isLoading, isError }, setState] = useState({
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    if (!src) {
      setState((prevValue) => ({
        isLoading: false,
        isError: true,
      }));
    } else {
      setState((prevValue) => ({
        isLoading: true,
        isError: false,
      }));
    }
  }, [src]);

  const onError = (e: Event) => {
    setState((prevValue) => ({
      isLoading: false,
      isError: true,
    }));
    (e.target as any).src = '/images/blank.png';
  };

  const onLoad = () => {
    setTimeout(
      () =>
        setState((prevValue) => ({
          isLoading: false,
          isError: false,
        })),
      50,
    );
  };

  const imgStyle = {
    objectFit: ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(objectFit)
      ? objectFit
      : 'cover',
  };

  return (
    <div
      className={clsx('Image', styles.container, className, {
        isLoading,
        isError,
      })}
    >
      <img
        className={styles.img}
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError as any}
        referrerPolicy={noReferrer ? 'no-referrer' : 'strict-origin-when-cross-origin'}
        style={imgStyle}
      />
      <div className={styles.errorIcon}>
        <BrokenImageRoundedIcon fontSize="large" />
      </div>
      {isLoading && <SkeletonLoader skeleton={skeleton} length={1} />}
    </div>
  );
}
