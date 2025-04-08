import { useState, useCallback, ChangeEvent, ChangeEventHandler } from 'react';

export function useInputs<T>(
  initialForm: T,
): [T, ChangeEventHandler<HTMLInputElement>, () => void] {
  const [form, setForm] = useState(initialForm);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const { name, type, value, checked } = e.target;
    console.log('onChange', { name, type, value, checked });
    if (type === 'checkbox') {
      setForm((form) => ({ ...form, [name]: checked }));
      return;
    }
    setForm((form) => ({ ...form, [name]: value }));
  }, []);

  const reset = useCallback(() => setForm(initialForm), [initialForm]);
  return [form, onChange, reset];
}
