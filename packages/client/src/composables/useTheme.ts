import { ref, watch, computed } from 'vue'

export type BrightnessMode = 'light' | 'dark' | 'system'

const BRIGHTNESS_KEY = 'hermes_brightness'
const STYLE_KEY = 'hermes_style'

const brightness = ref<BrightnessMode>(
  (localStorage.getItem(BRIGHTNESS_KEY) as BrightnessMode) || 'system',
)

const isDark = ref(false)

function resolveDark(b: BrightnessMode): boolean {
  if (b === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return b === 'dark'
}

function applyClasses() {
  const dark = resolveDark(brightness.value)
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
}

// Initial
applyClasses()

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (brightness.value === 'system') {
    applyClasses()
  }
})

// Persist & apply on change
watch(brightness, (b) => {
  localStorage.setItem(BRIGHTNESS_KEY, b)
  applyClasses()
})

export function useTheme() {
  const themeName = computed(() => {
    const b = isDark.value ? 'dark' : 'light'
    return b
  })

  function setBrightness(b: BrightnessMode) {
    brightness.value = b
  }

  function toggleBrightness() {
    brightness.value = isDark.value ? 'light' : 'dark'
  }


  return {
    brightness,
    isDark,
    themeName,
    setBrightness,
    toggleBrightness,
  }
}
