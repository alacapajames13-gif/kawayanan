/* ---------------- View switching ---------------- */
function switchView(view){
  document.getElementById('view-landing').classList.toggle('active', view==='landing');
  document.getElementById('view-customer').classList.toggle('active', view==='customer');
  document.getElementById('view-admin').classList.toggle('active', view==='admin');
  document.getElementById('tabHomeBtn').classList.toggle('active', view==='landing');
  document.getElementById('tabCustomerBtn').classList.toggle('active', view==='customer');
  document.getElementById('tabAdminBtn').classList.toggle('active', view==='admin');
  window.scrollTo({top:0, behavior:'instant'});
  if(view==='admin' && document.getElementById('adminDashboard').style.display !== 'none'){
    renderAdminGrid(); renderReservationsTable();
  }
}
function checkPasscode(){
  const val = document.getElementById('passcodeInput').value;
  if(val === ADMIN_CODE){
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderAdminGrid(); renderReservationsTable();
  } else {
    document.getElementById('gateErr').style.display = 'block';
  }
}
