/* ---------------- Auth ---------------- */
function closeAllModals(){
  document.getElementById('bookingOverlay').classList.remove('active');
  document.getElementById('loginOverlay').classList.remove('active');
  document.getElementById('signupOverlay').classList.remove('active');
  currentBookingUnit = null;
}
function openLoginModal(){
  closeAllModals();
  document.getElementById('loginErr').style.display = 'none';
  document.getElementById('liEmail').value = '';
  document.getElementById('liPass').value = '';
  document.getElementById('loginOverlay').classList.add('active');
}
function openSignupModal(){
  closeAllModals();
  document.getElementById('signupErr').style.display = 'none';
  document.getElementById('suName').value = '';
  document.getElementById('suEmail').value = '';
  document.getElementById('suContact').value = '';
  document.getElementById('suPass').value = '';
  document.getElementById('signupOverlay').classList.add('active');
}
function updateAuthUI(){
  const loggedOut = document.getElementById('authActionsLoggedOut');
  const loggedIn = document.getElementById('authActionsLoggedIn');
  if(currentUser){
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'flex';
    document.getElementById('userChipName').textContent = currentUser.name.split(' ')[0];
  } else {
    loggedOut.style.display = 'flex';
    loggedIn.style.display = 'none';
  }
}
async function signupUser(){
  const name = document.getElementById('suName').value.trim();
  const email = document.getElementById('suEmail').value.trim().toLowerCase();
  const contact = document.getElementById('suContact').value.trim();
  const pass = document.getElementById('suPass').value;
  const errEl = document.getElementById('signupErr');
  if(!name || !email || !contact || pass.length < 6){
    errEl.textContent = 'Please fill in every field - password needs at least 6 characters.';
    errEl.style.display = 'block';
    return;
  }
  // Prevent customers from using the staff/admin passcode as their account password
  if(pass === ADMIN_CODE){
    errEl.textContent = 'Passwords may not match the staff passcode. Choose a different password.';
    errEl.style.display = 'block';
    return;
  }
  if(users.some(u => u.email === email)){
    errEl.textContent = 'An account with that email already exists - try logging in instead.';
    errEl.style.display = 'block';
    return;
  }
  const user = {id:'u_'+Date.now(), name, email, contact, passHash: simpleHash(pass), createdAt: Date.now()};
  users.push(user);
  await saveUsers();
  currentUser = user;
  updateAuthUI();
  closeAllModals();
  showToast(`Welcome, ${name.split(' ')[0]}! Account created.`);
  if(pendingReserveAfterLogin){
    const uid = pendingReserveAfterLogin; pendingReserveAfterLogin = null;
    openBooking(uid);
  } else {
    switchView('customer');
  }
}
async function loginUser(){
  const email = document.getElementById('liEmail').value.trim().toLowerCase();
  const pass = document.getElementById('liPass').value;
  const errEl = document.getElementById('loginErr');
  // Disallow using the staff/admin passcode through the customer login form
  if(pass === ADMIN_CODE){
    errEl.textContent = 'That looks like the staff passcode — please use the Staff Sign-in instead.';
    errEl.style.display = 'block';
    return;
  }
  const user = users.find(u => u.email === email && u.passHash === simpleHash(pass));
  if(!user){
    errEl.style.display = 'block';
    return;
  }
  currentUser = user;
  updateAuthUI();
  closeAllModals();
  showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
  if(pendingReserveAfterLogin){
    const uid = pendingReserveAfterLogin; pendingReserveAfterLogin = null;
    openBooking(uid);
  } else {
    switchView('customer');
  }
}
function logoutUser(){
  currentUser = null;
  updateAuthUI();
  showToast('Logged out.');
  switchView('landing');
}
function handleReserveCTA(){
  if(currentUser){ switchView('customer'); }
  else { openSignupModal(); }
}
