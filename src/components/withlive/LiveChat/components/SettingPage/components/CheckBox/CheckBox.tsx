import { ChangeEventHandler } from 'react';
import clsx from 'clsx';

import styles from './CheckBox.module.scss';

export interface Props {
  children: React.ReactNode;
  className?: string;
  name: string;
  value?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
}

export const CheckBox = (props: Props) => {
  return (
    <div className={clsx('CheckBox', styles.container, props.className)}>
      <label className={styles.label}>
        <div className={styles.content}>{props.children}</div>
        <input type="checkbox" name={props.name} onChange={props.onChange} checked={props.value} />
        <div className={clsx(styles.slider, { [styles.on]: props.value })}>
          <div className={styles.background}></div>
          <div className={styles.ball}></div>
        </div>
      </label>
    </div>
  );
};
