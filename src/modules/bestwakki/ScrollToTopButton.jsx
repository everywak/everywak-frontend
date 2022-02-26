import styles from './ScrollToTopButton.scss';

import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';

import Button from '../../common/Components/Button';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 페이지 최상단으로 이동하는 버튼
 * 
 * @param {{show: boolean}} props 
 */
function ScrollToTopButton({show = false}) {

  const gotoTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <Button className={cx('ScrollToTopButton', {show: show})}
      iconSrc={<KeyboardArrowUpRoundedIcon fontSize="small" />} 
      iconBGColor="white"
      label="맨 위로"
      onclick={gotoTop}
      showLabel={false} />
  );
}

export default ScrollToTopButton;