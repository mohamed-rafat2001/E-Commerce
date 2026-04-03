import { useThemeContext } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="
        p-2 rounded-full
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-300
        transition-colors duration-300
        min-w-[44px] min-h-[44px]
        flex items-center justify-center
      "
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
