import clsx from 'clsx';
import { ComponentProps } from './types';
import { CheckBox, Group } from './components';
import styles from './SettingPage.module.scss';
import React from 'react';

export interface Props {
  className?: string;
  title: string;
  items: ComponentProps[];
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

export const SettingPage = React.memo((props: Props) => {
  const comps = props.items.map((item, i) => {
    switch (item.type) {
      case 'checkbox':
        return (
          <CheckBox
            key={i}
            name={item.name}
            value={item.value}
            onChange={item.onChange}
            onClick={item.onClick}
          >
            {item.label}
          </CheckBox>
        );
      case 'group':
        return <Group key={i} title={item.title} />;
      default:
        return <></>;
    }
  });

  return (
    <div className={clsx(styles.container, props.className)}>
      <header className={styles.header}>
        <div className={styles.left}>
          {props.leftButton}
          <span>{props.title}</span>
        </div>
        {props.rightButton}
      </header>
      <div className={styles.content}>{comps}</div>
    </div>
  );
});
