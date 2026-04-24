/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const value = useTheme();
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};
