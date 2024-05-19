import { ReactElement } from 'react';
import { IInput } from '../../common/interfaces/Props';

export function Input({
  name,
  value,
  setValue,
  onSubmit,
  className = undefined,
  placeholder = undefined,
  submitOnBlur = false,
}: IInput): ReactElement {
  const id = name;

  return (
    <input
      {...{ name, id, className, placeholder }}
      type="text"
      autoComplete="off"
      ref={(input) => input?.focus()}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => (e.key === 'Enter' ? onSubmit() : null)}
      onBlur={() => (submitOnBlur ? onSubmit() : null)}
    />
  );
}
