
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    const handleChange = () => {
      setValue(matchMedia.matches);
    };

    // Initial check
    handleChange();

    // Listener for changes
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return value;
}
