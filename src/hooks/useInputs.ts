import { useState, useCallback } from 'react';

export type InputChangeHandler<T> = (
  e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: T } },
) => void;

export const useInputs = <T = Record<string, any>>(
  initialForm: T,
): [T, InputChangeHandler<T[keyof T]>, () => void] => {
  const [form, setForm] = useState(initialForm);

  const onChange: InputChangeHandler<T[keyof T]> = useCallback((e) => {
    if (e.target instanceof HTMLInputElement) {
      const { name, type, value, checked } = e.target;
      if (type === 'checkbox') {
        setForm((form) => ({ ...form, [name]: checked }));
        return;
      }
      setForm((form) => ({ ...form, [name]: value }));
    } else if ('name' in e.target && 'value' in e.target) {
      const { name, value } = e.target;
      setForm((form) => ({ ...form, [name]: value }));
    }
  }, []);

  const reset = useCallback(() => setForm(initialForm), [initialForm]);
  return [form, onChange, reset];
};
