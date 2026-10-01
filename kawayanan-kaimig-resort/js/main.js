/* ---------------- Init ---------------- */
(async function init(){
  await loadData();
  updateAuthUI();
  expireOldReservations();
  await renderAll();
  tickClock();
  setInterval(tickClock, 1000);
  setInterval(() => {
    expireOldReservations();
    renderAll();
  }, 1000);
  setInterval(pollRefresh, 5000);
})();
