import React from 'react';

export type ComponentProps = CheckBoxProps | GroupProps | SelectProps | CollectorCustomInputProps;

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

export type SelectProps = {
  type: 'select';
  name: string;
  value: string;
  label: React.ReactNode;
  options: {
    name: string;
    value: string;
  }[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type CollectorCustomInputProps = {
  type: 'collectorCustomInput';
};
