import { useState, useEffect } from 'react';

/**
 * Debounces a value by the specified delay in milliseconds.
 * Returns the debounced value, which only updates after the user stops
 * changing the input for the given delay period.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
