import { useState } from 'react';

export function SkipToContent() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <a
      href="#main-content"
      className={`
        fixed top-0 left-0 p-3 bg-blue-600 text-white transition-transform duration-200
        ${isFocused ? 'translate-y-0' : '-translate-y-full'}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      Pular para o conteúdo principal
    </a>
  );
}