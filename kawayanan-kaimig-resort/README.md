# Kawayanan KaiMig Resort — Reservations

```
index.html          markup only: header, 3 views (landing / customer / admin), modals
assets/hero.webp    landing hero photo (was an inline base64 string)
css/
  base.css          tokens, resets, page background, view switching
  header.css        sticky header, tabs, auth chip
  hero.css          hero blocks + landing photo background
  landing.css       landing-only sections
  units.css         section headers, cottage/pool grid
  modal.css         modals, forms, toast
  lookup.css        reservation lookup
  admin.css         staff dashboard
js/                 classic scripts, loaded in this order (they share globals)
  config.js         keys, admin code, seed units, shared state
  storage.js        window.storage wrappers, load/save
  utils.js          code generator, dates, demo hash
  render.js         all render* functions
  views.js          view switching, staff passcode
  auth.js           modals, sign up / log in / log out
  booking.js        booking flow
  admin.js          unit status + reservation updates
  lookup.js         lookup by code + contact
  ui.js             toast, clock, polling
  main.js           init
```

Notes
- Behaviour is unchanged: the CSS and JS are byte-for-byte the original, only split.
- Persistence uses `window.storage`, which exists only inside Claude artifacts.
  Outside Claude, saves fail with a toast; swap `storage.js` for localStorage or a real API.
- The staff passcode and password hash are client-side demo code, not real security.
