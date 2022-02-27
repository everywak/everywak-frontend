import styled, { css } from 'styled-components';

import styles from './CircleImg.scss';
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
    className, src, alt, objectFit = 'cover', padding = 0
  } = props;
  

  return (
    <div className={cx('CircleImg', className)} {...props}>
        <Image src={src} alt={alt} objectFit={objectFit} padding={padding} onError={e => {e.target.src = '/images/blank.png'}} />
    </div>
  );

}

export default CircleImg;