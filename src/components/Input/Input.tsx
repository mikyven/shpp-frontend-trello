import { ReactElement, useRef, useEffect } from 'react';
import { InputProps } from '../../common/types/props';

export function Input({
  name,
  value,
  setValue,
  onSubmit,
  className = undefined,
  placeholder = undefined,
  submitOnBlur = false,
  selectContent = false,
  escapeFunction = undefined,
}: InputProps): ReactElement {
  const id = name;
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectContent) ref.current?.select();
  }, []);

  function onKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'Enter') onSubmit();
    else if (e.key === 'Escape' && escapeFunction) escapeFunction();
  }

  return (
    <input
      {...{ name, id, className, placeholder }}
      type="text"
      autoComplete="off"
      ref={(input) => {
        input?.focus();
        ref.current = input;
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => (submitOnBlur ? onSubmit() : null)}
    />
  );
}
