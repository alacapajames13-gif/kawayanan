/* ---------------- Rendering ---------------- */
function statusLabel(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

function renderCustomerGrid(){
  const grid = document.getElementById('customerGrid');
  grid.innerHTML = units.map(u => `
    <div class="card status-${u.status}">
      <div class="culm-bar"></div>
      <div class="body">
        <div class="top-row">
          <div><h3>${u.name}</h3><div class="type">${u.type} - up to ${u.capacity}</div></div>
          <span class="badge status-${u.status}">${statusLabel(u.status)}</span>
        </div>
        <div class="meta">P${u.price} <span style="opacity:0.6">/ slot</span></div>
        <div class="actions">
          <button class="btn btn-primary btn-sm" ${u.status==='available' ? '' : 'disabled'} onclick="openBooking('${u.id}')">
            ${u.status==='available' ? 'Reserve' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMyReservations(){
  const wrap = document.getElementById('myReservationsWrap');
  const list = document.getElementById('myReservationsList');
  if(!currentUser){ wrap.style.display = 'none'; return; }
  const mine = reservations.filter(r => r.userEmail === currentUser.email)
                            .sort((a,b)=> b.createdAt - a.createdAt);
  if(mine.length === 0){
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = 'block';
  list.innerHTML = mine.map(r => `
    <div class="my-res-card">
      <div class="left">
        <div class="unit">${r.unitName}</div>
        <div class="meta">${r.date} - ${r.slot} - ${r.guests} guest(s)</div>
      </div>
      <div style="text-align:right;">
        <div class="code">${r.code}</div>
        <span class="badge status-${statusBadgeClass(r.status)}">${statusLabel(r.status)}</span>
      </div>
    </div>
  `).join('');
}

function renderAdminGrid(){
  const grid = document.getElementById('adminGrid');
  grid.innerHTML = units.map(u => `
    <div class="card status-${u.status}">
      <div class="culm-bar"></div>
      <div class="body">
        <div class="top-row">
          <div><h3>${u.name}</h3><div class="type">${u.type} - up to ${u.capacity}</div></div>
          <span class="badge status-${u.status}">${statusLabel(u.status)}</span>
        </div>
        <div class="meta">P${u.price} / slot</div>
        <div class="actions">
          <button class="btn btn-sm btn-available" onclick="setUnitStatus('${u.id}','available')">Available</button>
          <button class="btn btn-sm btn-reserved" onclick="setUnitStatus('${u.id}','reserved')">Reserved</button>
          <button class="btn btn-sm btn-occupied" onclick="setUnitStatus('${u.id}','occupied')">Occupied</button>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('admStatAvail').textContent = units.filter(u=>u.status==='available').length;
  document.getElementById('admStatReserved').textContent = units.filter(u=>u.status==='reserved').length;
  document.getElementById('admStatOccupied').textContent = units.filter(u=>u.status==='occupied').length;
  document.getElementById('admStatPending').textContent = reservations.filter(r=>r.status==='pending').length;
  document.getElementById('lastUpdated').textContent = 'Last synced ' + new Date().toLocaleTimeString();
}

function renderReservationsTable(){
  const body = document.getElementById('resTableBody');
  const sorted = [...reservations].sort((a,b)=> b.createdAt - a.createdAt);
  document.getElementById('resCount').textContent = sorted.length + ' total';
  if(sorted.length === 0){
    body.innerHTML = `<tr><td colspan="8" class="empty">No reservations yet - bookings will appear here in real time.</td></tr>`;
    return;
  }
  body.innerHTML = sorted.map(r => `
    <tr>
      <td style="font-family:var(--font-mono)">${r.code}</td>
      <td>${r.guestName}<br><span style="color:var(--ink-soft); font-size:0.75rem">${r.contact}</span></td>
      <td>${r.unitName}</td>
      <td>${r.date}</td>
      <td>${r.slot}</td>
      <td>${r.guests}</td>
      <td><span class="badge status-${statusBadgeClass(r.status)}">${statusLabel(r.status)}</span></td>
      <td class="row-actions">
        ${r.status==='pending' ? `<button class="btn btn-sm btn-available" onclick="updateReservation('${r.id}','confirmed')">Confirm</button>` : ''}
        ${(r.status==='pending'||r.status==='confirmed') ? `<button class="btn btn-sm btn-ghost" onclick="updateReservation('${r.id}','checked-in')">Check-in</button>` : ''}
        ${r.status==='checked-in' ? `<button class="btn btn-sm btn-ghost" onclick="updateReservation('${r.id}','checked-out')">Check-out</button>` : ''}
        ${(r.status!=='cancelled' && r.status!=='checked-out') ? `<button class="btn btn-sm btn-occupied" onclick="updateReservation('${r.id}','cancelled')">Cancel</button>` : ''}
      </td>
    </tr>
  `).join('');
}
function statusBadgeClass(s){
  if(s==='confirmed'||s==='checked-in') return 'occupied';
  if(s==='pending') return 'reserved';
  return 'available';
}

async function renderAll(){
  renderCustomerGrid();
  renderMyReservations();
  if(document.getElementById('adminDashboard').style.display !== 'none'){
    renderAdminGrid();
    renderReservationsTable();
  }
}
