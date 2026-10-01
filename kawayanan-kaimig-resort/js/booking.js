/* ---------------- Booking flow ---------------- */
function openBooking(unitId){
  if(!currentUser){
    pendingReserveAfterLogin = unitId;
    openLoginModal();
    showToast('Please log in to reserve a unit.');
    return;
  }
  currentBookingUnit = units.find(u=>u.id===unitId);
  if(!currentBookingUnit) return;
  closeAllModals();
  document.getElementById('bookingFormWrap').style.display = 'block';
  document.getElementById('bookingConfirmWrap').style.display = 'none';
  document.getElementById('bookingUnitName').textContent = 'Reserve ' + currentBookingUnit.name;
  document.getElementById('bookingUnitMeta').textContent = `${currentBookingUnit.type} - up to ${currentBookingUnit.capacity} guests - P${currentBookingUnit.price}/slot`;
  document.getElementById('gName').value = currentUser.name || '';
  document.getElementById('gContact').value = currentUser.contact || '';
  document.getElementById('gDate').value = todayISO();
  document.getElementById('gDate').min = todayISO();
  document.getElementById('gGuests').value = 2;
  document.getElementById('gGuests').max = currentBookingUnit.capacity;
  document.getElementById('bookingErr').style.display = 'none';
  document.getElementById('bookingOverlay').classList.add('active');
}
async function submitBooking(){
  const name = document.getElementById('gName').value.trim();
  const contact = document.getElementById('gContact').value.trim();
  const date = document.getElementById('gDate').value;
  const guests = parseInt(document.getElementById('gGuests').value,10);
  const slot = document.getElementById('gSlot').value;
  if(!name || !contact || !date || !guests){
    document.getElementById('bookingErr').style.display = 'block';
    return;
  }
  document.getElementById('bookingErr').style.display = 'none';

  const code = genCode();
  const expiresAt = Date.now() + HOLD_MINUTES * 60 * 1000;
  const reservation = {
    id: 'r_' + Date.now(),
    code, unitId: currentBookingUnit.id, unitName: currentBookingUnit.name,
    guestName: name, contact, date, guests, slot,
    userEmail: currentUser ? currentUser.email : null,
    status: 'pending', createdAt: Date.now(), expiresAt
  };
  reservations.push(reservation);
  await saveReservations();

  if(currentBookingUnit.status !== 'occupied'){
    currentBookingUnit.status = 'reserved';
    currentBookingUnit.expiresAt = expiresAt;
    await saveUnits();
  }

  document.getElementById('bookingFormWrap').style.display = 'none';
  document.getElementById('bookingConfirmWrap').style.display = 'block';
  document.getElementById('confirmCode').textContent = code;
  await renderAll();
}
