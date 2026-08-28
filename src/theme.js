// ============================================================
// THEME.JS — the ONE file you need to edit to restyle the app.
// ============================================================
// Change a hex code here and it updates the whole app (all
// buttons, headers, cards, etc. read from these values).
// Change a category's `image` to a real photo/logo path and it
// will replace the emoji icon everywhere that category appears.
// ============================================================

export const theme = {
  appName: 'RH Poultry Store',
  appSubtitle: 'Cloud-Synced Inventory',

  // Path to a logo image shown in the header instead of the emoji.
  // Put your file in /public/images/ and reference it as '/images/yourfile.png'
  // Leave as null to keep using the emoji title.
  logo: null,

  colors: {
    primary: '#00897B',       // main brand color (buttons, active states)
    primaryDark: '#00695C',   // header gradient end, hover states
    primaryLight: '#E0F2F1',  // light chip/badge backgrounds
    background: '#F5F5F5',    // page background
    surface: '#FFFFFF',       // cards, modal background
    text: '#333333',          // main text
    textMuted: '#666666',     // secondary/help text
    priceText: '#2E7D32',     // price amounts
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    infoBlue: '#2196F3',      // edit button color
  },

  // Optional background IMAGES. Leave any of these as `null` to keep
  // using the solid color / gradient from `colors` above. Set a path
  // (e.g. '/images/header-bg.jpg', from a file you put in public/images/)
  // to use a photo/texture there instead. Images are automatically
  // sized to cover the whole element and centered.
  backgroundImages: {
    header: '/images/app-bg.jpg',            // top bar behind the title
    appBackground: '/images/app-bg.jpg',     // behind the whole app, all pages
    card: '/images/app-bg.jpg',              // product cards, stat cards, settings cards, search box, modal
    buttonPrimary:'/images/app-bg.jpg',     // FAB (+), Save button, main Settings buttons
        categoryChipActive: null, // the selected category chip on Home pae
  },

  // Every category shown in the dropdown, chips, and cards.
  // `icon` is an emoji fallback. Set `image` to a path (e.g. a
  // product photo or a small icon PNG/SVG in /public/images/) to
  // use a real picture instead of the emoji anywhere it appears.
  categories: {
  allChip: { icon: '', label: 'All', image: '/images/app-bg.jpg' },  
  Chicken: { icon: '', image: '/images/chicken.jpg' },
  Feeds: { icon: '', image: '/images/feeds.jpg' },
  Meds: { icon: '', image: '/images/medicine.jpg' },
  Vitamins: { icon: '', image: '/images/vitamin.jpg' },
  Accessories: { icon: '', image: '/images/Accessories.jpg' },
  Dog: { icon: '', image: '/images/dog.jpg' },
  Cat: { icon: '', image: '/images/cat.jpg' },
  Pigeon: { icon: '', image: '/images/pigeon.jpg' },
  
}
}

// Applies theme.colors as CSS custom properties on <html>,
// so every component's CSS (which uses var(--color-primary), etc.)
// stays in sync automatically. Called once in App.jsx.
// Combines an optional image with a fallback color/gradient into one
// CSS `background` shorthand value. If `image` is set, it's layered
// on top (covering, centered) with the fallback showing through any
// transparent edges; if not, the fallback alone is used.
function bg(image, fallback) {
  return image ? `url('${image}') center / cover no-repeat, ${fallback}` : fallback
}

export function applyTheme() {
  const root = document.documentElement
  const c = theme.colors
  const bgi = theme.backgroundImages

  root.style.setProperty('--color-primary', c.primary)
  root.style.setProperty('--color-primary-dark', c.primaryDark)
  root.style.setProperty('--color-primary-light', c.primaryLight)
  root.style.setProperty('--color-background', c.background)
  root.style.setProperty('--color-surface', c.surface)
  root.style.setProperty('--color-text', c.text)
  root.style.setProperty('--color-text-muted', c.textMuted)
  root.style.setProperty('--color-price', c.priceText)
  root.style.setProperty('--color-success', c.success)
  root.style.setProperty('--color-error', c.error)
  root.style.setProperty('--color-warning', c.warning)
  root.style.setProperty('--color-info', c.infoBlue)

  const primaryGradient = `linear-gradient(135deg, ${c.primary} 0%, ${c.primaryDark} 100%)`

  root.style.setProperty('--bg-header', bg(bgi.header, primaryGradient))
  root.style.setProperty('--bg-app', bg(bgi.appBackground, c.background))
  root.style.setProperty('--bg-card', bg(bgi.card, c.surface))
  root.style.setProperty('--bg-btn-primary', bg(bgi.buttonPrimary, primaryGradient))
  root.style.setProperty('--bg-btn-danger', bg(bgi.buttonDanger, c.error))
  root.style.setProperty('--bg-btn-secondary', bg(bgi.buttonSecondary, '#757575'))
  root.style.setProperty('--bg-chip-active', bg(bgi.categoryChipActive, c.primary))
}

// Returns { icon, image } for a category, falling back to General.
export function getCategoryVisual(categoryName) {
  return theme.categories[categoryName] || theme.categories.General
}

export const categoryNames = Object.keys(theme.categories)
