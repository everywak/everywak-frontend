import React, { useCallback, useState, useRef, CSSProperties, ChangeEventHandler } from 'react';
import clsx from 'clsx';
import { ExpandMoreRounded } from '@mui/icons-material';
import { useWindowEvent } from 'hooks/useWindowEvent';

import styles from './Dropdown.module.scss';

export interface Props {
  className?: string;
  options: { name: string; value: string }[];
  name: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const Dropdown = ({ options = [], name, value, onChange = () => {} }: Props) => {
  const [opened, setOpened] = useState(false);
  const [dropdownAreaPos, setDropdownAreaPos] = useState({ x: 0, y: 0 });

  const btnSelect = useRef<HTMLSpanElement>(null);
  const dropdownArea = useRef<HTMLDivElement>(null);
  const selectedItem = useRef<HTMLDivElement>(null);

  const setOption = useCallback(
    (val: string) => {
      close();
      onChange({
        target: {
          value: val,
          name,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    },
    [name],
  );

  const posList = () => {
    const nameRect = btnSelect.current?.getBoundingClientRect();
    const list = dropdownArea.current;
    const listRect = list?.getBoundingClientRect();
    const target = selectedItem.current;
    const targetRect = (target ? target : list)?.getBoundingClientRect();

    if (!nameRect || !listRect || !targetRect) return;

    const tx = nameRect.left - (targetRect.left - listRect.left);
    const ty = nameRect.top - (targetRect.top - listRect.top) + 3;
    setDropdownAreaPos({
      x: tx,
      y: ty,
    });
  };

  const open = () => {
    setOpened(true);
    posList();
  };
  const close = () => {
    setOpened(false);
  };

  useWindowEvent('resize scroll', close, []);

  const list = options.map((item) => (
    <div
      key={item.value}
      className={clsx('option', styles.option, { [styles.checked]: value === item.value })}
      onClick={(e) => setOption(item.value)}
    >
      <div className={styles.marker} />
      <span className={styles.name} ref={value === item.value ? selectedItem : null}>
        {item.name}
      </span>
    </div>
  ));

  const dropdownAreaStyle = {
    '--left': `${dropdownAreaPos.x}px`,
    '--top': `${dropdownAreaPos.y}px`,
  } as CSSProperties;

  const selectedOption = options.find((item) => item.value === value);

  return (
    <div className={clsx('Dropdown', styles.container, { [styles.opened]: opened })}>
      <div className={styles.dispArea} onClick={open}>
        <span className={styles.currName} ref={btnSelect}>
          {(selectedOption && selectedOption.name) || ''}
        </span>
        <ExpandMoreRounded />
      </div>
      <div className={styles.closeArea} onClick={close}></div>
      <div className={styles.dropdownAreaWrapper} style={dropdownAreaStyle} ref={dropdownArea}>
        <div className={styles.dropdownArea}>{list}</div>
      </div>
    </div>
  );
};
