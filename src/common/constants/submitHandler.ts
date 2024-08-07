import { FormEvent } from 'react';
import { validationRegEx } from './regex';

export function onSubmit(
  value: string,
  valueHandler: (...args: string[]) => Promise<void>,
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
