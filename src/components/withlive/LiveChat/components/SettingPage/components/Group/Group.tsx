import clsx from 'clsx';

import styles from './Group.module.scss';

export interface Props {
  className?: string;
  title: string;
}

export const Group = (props: Props) => {
  return (
    <div className={clsx('Group', styles.container, props.className)}>
      {props.title}
    </div>
  );
};
