import clsx from 'clsx';

import { Select as BasicSelect } from 'common/components';
import { InputChangeHandler } from 'hooks/useInputs';
import styles from './Select.module.scss';

export interface Props {
  children: React.ReactNode;
  className?: string;
  name: string;
  value: string;
  options: {
    name: string;
    value: string;
  }[];
  onChange: InputChangeHandler<string>;
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
        onChange={props.onChange}
      />
    </div>
  );
};
