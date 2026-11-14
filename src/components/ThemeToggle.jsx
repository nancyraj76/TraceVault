import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/useTheme.js'
import './ThemeToggle.css'

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? Moon : Sun

  return (
    <button
      className={`theme-toggle${className ? ` ${className}` : ''}`}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={`Current theme: ${isDark ? 'Dark' : 'Light'} mode`}
      onClick={toggleTheme}
    >
      <Icon className="theme-toggle-icon" size={16} strokeWidth={1.9} aria-hidden="true" />
      <span className="theme-toggle-label">{isDark ? 'Dark mode' : 'Light mode'}</span>
    </button>
  )
}

export default ThemeToggle
