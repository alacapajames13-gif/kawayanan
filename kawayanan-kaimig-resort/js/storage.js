/* ---------------- Persistence layer with browser-safe fallback ---------------- */
async function storageGet(key, shared){
  try{
    const browserStorage = globalThis.storage;
    if (browserStorage && typeof browserStorage.get === 'function') {
      const res = await browserStorage.get(key, shared);
      return res && res.value ? JSON.parse(res.value) : null;
    }

    const raw = globalThis.localStorage ? globalThis.localStorage.getItem(key) : null;
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('storage get failed, falling back to empty state:', e);
    return null;
  }
}

async function storageSet(key, value, shared){
  try {
    const browserStorage = globalThis.storage;
    if (browserStorage && typeof browserStorage.set === 'function') {
      await browserStorage.set(key, JSON.stringify(value), shared);
      return;
    }

    if (globalThis.localStorage) {
      globalThis.localStorage.setItem(key, JSON.stringify(value));
      return;
    }

    console.warn('No browser storage available for key:', key);
  } catch (e) {
    console.error('storage set failed', e);
    if (typeof showToast === 'function') {
      showToast('Could not save - please retry.');
    }
  }
}

function normalizeUnits(savedUnits = []){
  if (!Array.isArray(savedUnits) || !savedUnits.length) {
    return DEFAULT_UNITS.map(unit => ({ ...unit }));
  }

  const savedById = new Map(savedUnits.map(unit => [unit.id, unit]));
  const mergedUnits = DEFAULT_UNITS.map(defaultUnit => {
    const savedUnit = savedById.get(defaultUnit.id) || {};
    return {
      ...defaultUnit,
      ...savedUnit,
      photo: defaultUnit.photo,
      id: defaultUnit.id,
      name: savedUnit.name || defaultUnit.name,
      type: savedUnit.type || defaultUnit.type,
      capacity: savedUnit.capacity || defaultUnit.capacity,
      price: savedUnit.price || defaultUnit.price,
      status: savedUnit.status || defaultUnit.status,
      expiresAt: savedUnit.expiresAt ?? defaultUnit.expiresAt,
    };
  });

  return mergedUnits;
}

async function loadData(){
  let u = await storageGet(UNITS_KEY, true);
  const normalizedUnits = normalizeUnits(u);
  if (!u || JSON.stringify(u) !== JSON.stringify(normalizedUnits)) {
    u = normalizedUnits;
    await storageSet(UNITS_KEY, u, true);
  }
  units = u;
  let r = await storageGet(RES_KEY, true);
  if(!r){ r = []; await storageSet(RES_KEY, r, true); }
  reservations = r;
  let us = await storageGet(USERS_KEY, true);
  if(!us){ us = []; await storageSet(USERS_KEY, us, true); }
  users = us;
}
async function saveUnits(){ await storageSet(UNITS_KEY, units, true); }
async function saveReservations(){ await storageSet(RES_KEY, reservations, true); }
async function saveUsers(){ await storageSet(USERS_KEY, users, true); }
