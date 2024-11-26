export const initializeTheme = () => {
  if (typeof window === 'undefined') return

  const getStoredTheme = (): 'dark' | 'light' => localStorage.getItem('theme') as any
  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = (theme: 'dark' | 'light') => {
    if (document.documentElement.getAttribute('data-bs-theme') !== theme) {
      document.documentElement.setAttribute('data-bs-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }

  // Initiële setup
  setTheme(getPreferredTheme())

  // Gebruik de moderne matchMedia API
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handleThemeChange = () => {
    setTheme(mediaQuery.matches ? 'dark' : 'light')
  }

  // Gebruik alleen de moderne addEventListener
  mediaQuery.addEventListener('change', handleThemeChange)

  // Cleanup functie (belangrijk voor React)
  return () => mediaQuery.removeEventListener('change', handleThemeChange)
}