import React from 'react';
import clsx from 'clsx';
import { InputChangeHandler } from 'hooks/useInputs';
import { Button } from '..';
import styles from './Select.module.scss';

export interface Props {
  className?: string;
  options: { name: string; value: string }[];
  name: string;
  value: string;
  onChange: InputChangeHandler<string>;
}

export function Select({ className, options, name, value, onChange = () => {} }: Props) {
  const optionList = options.map((opt) => (
    <Option
      key={opt.value}
      parent={name}
      name={opt.name}
      value={opt.value}
      isSelected={opt.value === value}
      onClick={onChange}
    />
  ));

  return <div className={clsx('Select', styles.container, className)}>{optionList}</div>;
}

const Option = React.memo(
  ({
    parent,
    name,
    value,
    isSelected,
    onClick = () => {},
  }: {
    parent: string;
    name: string;
    value: string;
    isSelected: boolean;
    onClick?: InputChangeHandler<string>;
  }) => {
    const _onClick = () =>
      onClick({
        target: {
          name: parent,
          value: value,
        },
      });
    return (
      <Button
        className={clsx('Option', styles.option, {
          [styles.selected]: isSelected,
        })}
        onClick={_onClick}
      >
        {name}
      </Button>
    );
  },
);
