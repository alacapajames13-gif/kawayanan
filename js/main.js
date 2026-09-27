/* ---------------- Init ---------------- */
(async function init(){
  await loadData();
  updateAuthUI();
  await renderAll();
  tickClock();
  setInterval(tickClock, 1000);
  setInterval(pollRefresh, 5000);
})();
