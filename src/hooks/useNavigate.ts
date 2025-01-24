import { useCallback } from 'react';

export function useNavigate() {
  const navigateToTab = useCallback((tab: string) => {
    // Dispatch custom event for tab change
    const event = new CustomEvent('tabChange', { detail: tab });
    window.dispatchEvent(event);
  }, []);

  return { navigateToTab };
}