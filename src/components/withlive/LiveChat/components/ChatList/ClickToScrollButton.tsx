import styles from './ClickToScrollButton.module.scss';
import classNames from 'classnames/bind';
import { Button } from 'common/components';
const cx = classNames.bind(styles);

export type Props = {
  className?: string;
  onClick: () => void;
};
export function ClickToScrollButton(props: Props) {
  return (
    <Button
      className={cx('ClickToScrollButton', props.className)}
      onClick={props.onClick}
    >
      클릭하여 스크롤
    </Button>
  );
}
