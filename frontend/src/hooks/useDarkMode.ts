import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    isDark: mounted ? resolvedTheme === 'dark' : false,
    toggleTheme,
    theme: mounted ? resolvedTheme : 'light',
  };
}
