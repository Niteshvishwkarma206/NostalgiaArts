# Era Nostalgia — Premium Art Gallery

A fully responsive, dark/light-mode art gallery built with **React + Vite + Tailwind CSS +
Firebase**. Customers can browse, search, and favorite artworks; admins manage the entire
catalog — including multi-file uploads (images, PDFs, videos, ZIPs) — from a dedicated
dashboard. New uploads appear on the live site instantly via realtime Firestore listeners
(or an in-browser event bus in Sandbox Mode).

---

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3 (custom gold/onyx design system, dark mode via `class`)
- React Router 6
- Framer Motion (page transitions, hover/scroll animations)
- Firebase Authentication, Cloud Firestore, Firebase Storage
- Leaflet (dark-tile map on the Contact page)
- lucide-react (icons)

---

## Running the Project

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

### Sandbox Mode (no Firebase required)

If you don't add Firebase credentials, the app **automatically** runs in Sandbox Mode: all
data (artworks, accounts, favorites, upload history) is stored in the browser's
`localStorage`, and 8 example artworks are seeded automatically on first load.

**Sandbox test credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | `xxxxxxxxxx` | `xxxxx` |
| Customer | `user@eranostalgia.com` | `xxxxx` |

> These are development-only sandbox credentials with no real backend behind them.

### Connecting Live Firebase

1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. Register a Web App and copy the config values.
3. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values.
4. In the Firebase Console, enable:
   - **Authentication → Sign-in method → Email/Password**
   - **Firestore Database** (start in test mode, then lock down rules for production)
   - **Storage** (for images/PDFs/videos/ZIPs)
5. Set `VITE_ADMIN_EMAIL` to the account that should receive admin dashboard access, and
   create that user under Authentication (or register it through the app's Sign Up page).
6. Restart the dev server. The app detects the Firebase config and switches off Sandbox
   Mode automatically — no code changes required.

---

## Contact Information (shown on the Contact page)

- **Email:** eranostalgia3@gmail.com
- **Mobile:** +91 8120524261
- **Address:** Bhopal Naka, Murli, Sehore, Madhya Pradesh, India

---

## Pages

Home · Gallery · Categories · Artists · Artwork Details · Favorites · About · Contact ·
Login · Register · Forgot Password · Customer Profile · Admin Dashboard · 404

## Admin Dashboard

Accessible at `/admin` after signing in with the admin account. From the dashboard, an
admin can:

- Drag-and-drop or browse to upload **images, PDFs, videos, and ZIP files** — multiple at
  once — with client-side validation for file type, file size, and duplicate uploads
- Add/edit an artwork's title, artist, category, description, year, price, availability,
  featured flag, tags, and enabled/disabled state
- Delete artworks
- View a running **upload history** log
- See catalog stats (total pieces, available, featured, total catalog value) at a glance

Because artworks are read through a realtime Firestore listener (or the sandbox event bus),
every change made in the dashboard reflects on the public gallery **instantly, with no page
refresh**.

## Project Structure

```
src/
  firebase.js              # Firebase init + Sandbox Mode auto-detection
  lib/
    db.js                  # Unified Firestore/localStorage data layer (realtime)
    storage.js              # File validation + Firebase Storage / sandbox upload
    seed.js                 # 8 seeded example artworks
  context/                 # Auth, Theme, Toast, Artwork, Favorites providers
  components/               # Navbar, Footer, ArtworkCard, MasonryGrid, Lightbox,
                             # FileUploader, AdminArtworkModal, ProtectedRoute, etc.
  pages/                    # One file per route, plus pages/admin/AdminDashboard.jsx
```

## Security Note

This project ships with **development/testing credentials** for convenience. Before
deploying publicly:

- Set real Firestore & Storage security rules restricting writes to the admin UID.
- Never keep sandbox/test passwords in a production build.
- Consider using Firebase custom claims (rather than a hardcoded admin email) for
  production-grade role checks.
