import React from 'react';
import clsx from 'clsx';
import { Button } from '@/common/components';

import styles from '../../Select.module.scss';
import stylesVariant from './TabSelect.module.scss';
import { InputChangeHandler } from '@/hooks/useInputs';

export interface Props {
  className: string;
  options: { name: string; value: string }[];
  name: string;
  value: string;
  onChange: InputChangeHandler<string>;
}

export function TabSelect({ className, options, name, value, onChange = () => {} }: Props) {
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

  return (
    <div className={clsx('TabSelect', styles.container, stylesVariant.container, className)}>
      {optionList}
    </div>
  );
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
        className={clsx('Option', styles.option, stylesVariant.option, {
          [styles.selected]: isSelected,
          [stylesVariant.selected]: isSelected,
        })}
        color="black-transparent"
        onClick={_onClick}
      >
        {name}
      </Button>
    );
  },
);
