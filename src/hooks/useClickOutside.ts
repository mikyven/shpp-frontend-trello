import { MutableRefObject, useEffect } from 'react';

export default function useClickOutside(ref: MutableRefObject<HTMLElement | null>, callback: () => void): void {
  function handler(e: MouseEvent): void {
    if (ref.current?.contains(e.target as HTMLElement)) return;
    callback();
  }

  useEffect(() => {
    document.addEventListener('mousedown', handler);
    return (): void => document.removeEventListener('mousedown', handler);
  });
}
