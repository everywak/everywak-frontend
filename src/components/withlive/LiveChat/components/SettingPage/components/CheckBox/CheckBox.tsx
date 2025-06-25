import clsx from 'clsx';
import { InputChangeHandler } from '@/hooks/useInputs';

import styles from './CheckBox.module.scss';

export interface Props {
  children: React.ReactNode;
  className?: string;
  name: string;
  value?: boolean;
  onChange?: InputChangeHandler<boolean>;
  onClick?: () => void;
}

export const CheckBox = (props: Props) => {
  const onClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (props.onClick) {
      e.preventDefault();
      e.stopPropagation();
      props.onClick();
    }
  };

  return (
    <div className={clsx('CheckBox', styles.container, props.className)}>
      <label className={styles.label}>
        <div className={styles.content} onClick={onClick}>
          {props.children}
        </div>
        {props.onClick && <div className={styles.line} />}
        <input type="checkbox" name={props.name} onChange={props.onChange} checked={props.value} />
        <div className={clsx(styles.slider, { [styles.on]: props.value })}>
          <div className={styles.background}></div>
          <div className={styles.ball}></div>
        </div>
      </label>
    </div>
  );
};
