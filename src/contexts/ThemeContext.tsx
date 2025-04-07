import React, { createContext, useContext, useEffect } from 'react';
import { useStorage } from 'hooks';

export type Theme = 'light' | 'dark' | 'preferred';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface Props {
  readonly children: React.ReactNode;
}

export const ThemeProvider = (props: Props): React.ReactNode => {
  const [theme, _setTheme] = useStorage<Theme>('everywak.theme', 'preferred');

  const isDarkMode = () =>
    theme === 'dark' || window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode());
    _setTheme(theme);
  }, [theme]);

  const setTheme = (theme: Theme) => {
    _setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
