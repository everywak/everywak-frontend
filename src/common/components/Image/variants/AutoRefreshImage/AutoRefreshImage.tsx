import { useEffect, useState } from 'react';
import { BasicImage } from '../../BasicImage';

export interface Props {
  className?: string;
  src: string;
  alt: string;
  noReferrer?: boolean;
  objectFit?: 'cover' | 'contain';
  interval?: number;
}

export const AutoRefreshImage = ({ interval, src, ...rest }: Props) => {
  const [randomSeed, update] = useState(Date.now());
  useEffect(() => {
    const loop = setInterval(() => update(Date.now()), 1000);
    return () => clearInterval(loop);
  }, []);

  const params = new URLSearchParams(src.includes('?') ? src.split('?')[1] : '');
  params.set('seed', randomSeed.toString());

  // without params  url
  const baseUrl = src.split('?')[0];

  return <BasicImage src={`${baseUrl}?${params.toString()}`} {...rest} />;
};
