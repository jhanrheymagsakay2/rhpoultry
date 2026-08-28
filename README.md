# RH Poultry Store — React + Vite

Your poultry store inventory app, rebuilt as a proper React project so it's
easy to edit in VS Code and deploy to Vercel. Same features as before
(cloud sync via Firebase, categories, search, import/export/merge,
duplicate detection, auto title-case) — just organized into files instead
of one giant HTML page.

## 🎨 Changing colors or category icons/images

Open **`src/theme.js`**. Everything visual lives there:

- `colors` — edit any hex value and the whole app updates (header, buttons,
  chips, prices, everything reads from these).
- `categories` — each category has an `icon` (emoji) and an `image` (set
  to `null` by default). To use a real photo/logo for a category instead
  of the emoji, drop the image file in `public/images/` and set:
  ```js
  Chicken: { icon: '🐔', image: '/images/chicken.png' },
  ```
- `logo` — set this to `/images/your-logo.png` to replace the emoji in the
  header with your own logo.
- `backgroundImages` — use a photo/texture instead of a flat color anywhere:
  header bar, whole-app background, cards, buttons (FAB, Save, Delete All,
  Import/Merge), and the active category chip. Drop the image in
  `public/images/`, then set the matching field, e.g.:
  ```js
  backgroundImages: {
    header: '/images/header-bg.jpg',
    buttonPrimary: '/images/wood-texture.jpg',
  }
  ```
  Leave any field `null` to keep the current solid color/gradient there.
  Images are auto-scaled to cover and centered, and text over them gets a
  subtle shadow for readability — but for buttons/header text to stay
  legible, pick images that are reasonably dark or low-contrast.

You don't need to touch any CSS or component files to restyle the app.

## 🖥️ Running locally in VS Code

1. Install [Node.js](https://nodejs.org/) (v18 or later) if you don't have it.
2. Open this folder in VS Code.
3. Open a terminal (``Ctrl+` ``) and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the URL it prints (usually `http://localhost:5173`) in your browser.

Any edit you save (including in `theme.js`) will hot-reload instantly.

## ☁️ Firebase

The app is pre-configured with your existing Firebase project, so it works
immediately — no setup needed. If you ever want to point it at a different
Firebase project (or keep keys out of source control), copy `.env.example`
to `.env` and fill in your project's values from the Firebase Console.

## 🚀 Deploying to Vercel

**Option A — via GitHub (recommended):**
1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import
   that repository.
3. Vercel auto-detects Vite. Leave the default build settings
   (`npm run build`, output directory `dist`) and click **Deploy**.
4. If you set up `.env` locally, add the same variables under
   **Project Settings → Environment Variables** in Vercel.

**Option B — via CLI:**
```bash
npm install -g vercel
vercel
```
Follow the prompts; Vercel will detect the Vite project automatically.

## 📁 Project structure

```
src/
  theme.js              ← edit colors/icons/images here
  firebase.js            Firebase init
  App.jsx                 page routing, modal + toast state
  hooks/useProducts.js    Firestore real-time sync + CRUD
  components/             Header, BottomNav, ProductCard, ProductModal, etc.
  pages/                  HomePage, ManagePage, SettingsPage
  styles/global.css       all styling, reads CSS variables set from theme.js
public/images/           put your logo & category photos here
```
