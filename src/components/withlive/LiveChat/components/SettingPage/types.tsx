import React from 'react';

export type ComponentProps = CheckBoxProps | GroupProps;

export type CheckBoxProps = {
  type: 'checkbox';
  name: string;
  value: boolean;
  label: React.ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
};

export type GroupProps = {
  type: 'group';
  title: string;
};
