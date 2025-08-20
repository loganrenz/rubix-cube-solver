import { ref, watch, onMounted } from 'vue';

export const useTheme = () => {
  const isDark = ref(false);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setTheme = (dark: boolean) => {
    isDark.value = dark;
  };

  // Apply theme to document
  watch(isDark, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('theme', newValue ? 'dark' : 'light');

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newValue ? '#1f2937' : '#ffffff');
    }
  });

  // Load saved theme preference
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      isDark.value = prefersDark;
    }

    // Apply theme immediately
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    }
  });

  return {
    isDark,
    toggleTheme,
    setTheme,
  };
};
