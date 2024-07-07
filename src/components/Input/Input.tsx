import { ReactElement, useRef, useEffect } from 'react';

export type InputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  onSubmit?: (() => void) | undefined;
  className?: string | undefined;
  placeholder?: string | undefined;
  submitOnBlur?: boolean;
  selectContent?: boolean;
  escapeFunction?: (() => void) | undefined;
};

export function Input({
  name,
  value,
  setValue,
  onSubmit = undefined,
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
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    } else if (e.key === 'Escape' && escapeFunction) {
      escapeFunction();
    }
  }

  return (
    <input
      id={id}
      name={name}
      className={className}
      placeholder={placeholder}
      type="text"
      autoComplete="off"
      ref={(input) => {
        input?.focus();
        ref.current = input;
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => (submitOnBlur && onSubmit ? onSubmit() : null)}
    />
  );
}
