/* ---------------- Persistence layer (window.storage) and load/save helpers ---------------- */
async function storageGet(key, shared){
  try{
    const res = await window.storage.get(key, shared);
    return res ? JSON.parse(res.value) : null;
  }catch(e){ return null; }
}
async function storageSet(key, value, shared){
  try{ await window.storage.set(key, JSON.stringify(value), shared); }
  catch(e){ console.error('storage set failed', e); showToast('Could not save - please retry.'); }
}

async function loadData(){
  let u = await storageGet(UNITS_KEY, true);
  if(!u){ u = DEFAULT_UNITS; await storageSet(UNITS_KEY, u, true); }
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
