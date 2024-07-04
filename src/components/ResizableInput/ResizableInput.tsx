import { ReactElement } from 'react';
import { Input, InputProps } from '../Input/Input';

export function ResizableInput(props: InputProps): ReactElement {
  const { value } = props;
  return (
    <div className="resize-container">
      <span className="resize-text">{value}</span>
      <Input {...props} />
    </div>
  );
}
