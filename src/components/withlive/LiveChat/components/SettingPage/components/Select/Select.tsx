import { ChangeEventHandler } from 'react';
import clsx from 'clsx';

import styles from './Select.module.scss';
import { Select as BasicSelect } from 'common/components';

export interface Props {
  children: React.ReactNode;
  className?: string;
  name: string;
  value: string;
  options: {
    name: string;
    value: string;
  }[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
}

export const Select = (props: Props) => {
  return (
    <div className={clsx('Select', styles.container, props.className)}>
      <div className={styles.content}>{props.children}</div>
      <BasicSelect
        className={styles.select}
        options={props.options}
        name={props.name}
        value={props.value}
        onChange={
          props.onChange as ({ target }: { target: { name: string; value: string } }) => void
        }
      />
    </div>
  );
};
