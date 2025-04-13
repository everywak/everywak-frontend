import React from 'react';
import { InputChangeHandler } from 'hooks/useInputs';

export type ComponentProps = CheckBoxProps | GroupProps | SelectProps | CollectorCustomInputProps;

export type CheckBoxProps = {
  type: 'checkbox';
  name: string;
  value: boolean;
  label: React.ReactNode;
  onChange: InputChangeHandler<boolean>;
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
  onChange: InputChangeHandler<string>;
};

export type CollectorCustomInputProps = {
  type: 'collectorCustomInput';
};
