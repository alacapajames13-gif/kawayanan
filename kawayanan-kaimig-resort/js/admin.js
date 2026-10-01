/* ---------------- Admin actions ---------------- */
async function setUnitStatus(unitId, status){
  const u = units.find(x=>x.id===unitId);
  if(!u) return;
  u.status = status;
  if(status === 'reserved'){
    u.expiresAt = Date.now() + HOLD_MINUTES * 60 * 1000;
  } else {
    u.expiresAt = null;
  }
  await saveUnits();
  await renderAll();
  showToast(`${u.name} marked ${status}.`);
}
async function updateReservation(resId, newStatus){
  const r = reservations.find(x=>x.id===resId);
  if(!r) return;
  r.status = newStatus;
  if(newStatus === 'pending' || newStatus === 'confirmed'){
    r.expiresAt = Date.now() + HOLD_MINUTES * 60 * 1000;
  }
  await saveReservations();

  const u = units.find(x=>x.id===r.unitId);
  if(u){
    if(newStatus === 'pending' || newStatus === 'confirmed'){
      u.status = 'reserved';
      u.expiresAt = r.expiresAt;
    }
    if(newStatus === 'checked-in'){ u.status = 'occupied'; u.expiresAt = null; }
    if(newStatus === 'checked-out'){ u.status = 'available'; u.expiresAt = null; }
    if(newStatus === 'cancelled'){
      u.expiresAt = null;
      const stillActive = reservations.some(x=>x.unitId===u.id && x.date===todayISO() && x.status!=='cancelled' && x.id!==r.id);
      if(!stillActive) u.status = 'available';
    }
    await saveUnits();
  }
  await renderAll();
  showToast(`Reservation ${r.code} -> ${newStatus}.`);
}
