import { useState, useCallback } from 'react';

export function useInputs<T>(initialForm: T) {
  const [form, setForm] = useState(initialForm);

  const onChange = useCallback((e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  }, []);

  const reset = useCallback(() => setForm(initialForm), [initialForm]);
  return [form, onChange, reset];
}
