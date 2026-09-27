/* ---------------- Admin actions ---------------- */
async function setUnitStatus(unitId, status){
  const u = units.find(x=>x.id===unitId);
  if(!u) return;
  u.status = status;
  await saveUnits();
  await renderAll();
  showToast(`${u.name} marked ${status}.`);
}
async function updateReservation(resId, newStatus){
  const r = reservations.find(x=>x.id===resId);
  if(!r) return;
  r.status = newStatus;
  await saveReservations();

  const u = units.find(x=>x.id===r.unitId);
  if(u){
    if(newStatus === 'checked-in'){ u.status = 'occupied'; }
    if(newStatus === 'checked-out'){ u.status = 'available'; }
    if(newStatus === 'cancelled'){
      const stillActive = reservations.some(x=>x.unitId===u.id && x.date===todayISO() && x.status!=='cancelled' && x.id!==r.id);
      if(!stillActive) u.status = 'available';
    }
    await saveUnits();
  }
  await renderAll();
  showToast(`Reservation ${r.code} -> ${newStatus}.`);
}
