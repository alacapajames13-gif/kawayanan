/* ---------------- Lookup ---------------- */
function lookupReservation(){
  const code = document.getElementById('lookupCode').value.trim().toUpperCase();
  const contact = document.getElementById('lookupContact').value.trim();
  const box = document.getElementById('lookupResult');
  const r = reservations.find(x => x.code === code && x.contact === contact);
  if(!r){
    box.innerHTML = `<div class="rline">No matching reservation found. Check your code and contact number.</div>`;
    return;
  }
  box.innerHTML = `<div class="rline">
    <span><strong>${r.unitName}</strong> - ${r.date}, ${r.slot}</span>
    <span class="badge status-${statusBadgeClass(r.status)}">${statusLabel(r.status)}</span>
  </div>`;
}
