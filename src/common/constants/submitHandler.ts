import { FormEvent } from 'react';
import { validationRegEx } from './validation';

export function onSubmit(
  value: string,
  valueHandler: (value: string) => Promise<void>,
  hideForm: () => void
): () => void {
  return (e?: FormEvent) => {
    e?.preventDefault();
    if (value && validationRegEx.test(value)) {
      valueHandler(value);
    }
    hideForm();
  };
}
