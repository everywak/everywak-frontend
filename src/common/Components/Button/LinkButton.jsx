import { useHistory } from 'react-router';

import BasicButton from './BasicButton';

import classNames from 'classnames/bind';
const cx = classNames;

/**
 * 링크 버튼
 * 
 * @param {{
 * to?: string, 
 * href?: string,
 * target?: string,
 * background?: string, 
 * className?: string, 
 * onClick?: function, 
 * children?: JSX.Element|String}} props 
 */
function LinkButton(props) {

  const { push } = useHistory();

  const {
    to, 
    href,
    target,
    className, 
    onClick, 
    children, 
    ...rest
  } = props;

  return (
    <BasicButton className={cx("Link", className)} {...rest} onClick={e => { (onClick && onClick(e));(to && push(to));(href && window.open(href, target || '_blank')) }}>
      {children}
    </BasicButton>
  );
}

export default LinkButton;