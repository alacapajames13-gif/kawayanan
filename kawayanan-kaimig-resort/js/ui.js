/* ---------------- Toast + clock + polling ---------------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}
function tickClock(){
  document.getElementById('clock').textContent = new Date().toLocaleString('en-PH', {weekday:'short', hour:'2-digit', minute:'2-digit', second:'2-digit'});
}

async function pollRefresh(){
  const freshUnits = await storageGet(UNITS_KEY, true);
  const freshRes = await storageGet(RES_KEY, true);
  if(freshUnits) units = freshUnits;
  if(freshRes) reservations = freshRes;
  await renderAll();
}
