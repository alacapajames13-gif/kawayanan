/* ---------------- Rendering ---------------- */
function statusLabel(s){
  const labels = {
    available: 'Available',
    reserved: 'Reserved',
    occupied: 'Occupied',
    pending: 'Pending',
    confirmed: 'Confirmed',
    'checked-in': 'Checked In',
    'checked-out': 'Checked Out',
    cancelled: 'Cancelled'
  };
  return labels[s] || s.charAt(0).toUpperCase() + s.slice(1);
}

function generateUnitArtwork(unit){
  if (unit && unit.photo) return unit.photo;

  const fallback = unit && unit.type === 'Pool'
    ? 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80'
    : 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80';

  return fallback;
}

function formatExpiryTime(timestamp){
  if(!timestamp) return '—';
  return new Date(timestamp).toLocaleString('en-PH', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function formatCountdown(timestamp){
  const remaining = Math.max(0, timestamp - Date.now());
  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2,'0')}s`;
}

function getExpiryMarkup(expiryTimestamp){
  if(!expiryTimestamp) return '';
  return `
    <div class="meta" style="margin-top:8px; color:#7d4d0a; font-size:0.76rem; font-weight:600;">
      Expires: ${formatExpiryTime(expiryTimestamp)}
      <span style="display:block; color:#a65a00; margin-top:2px;">Live countdown: ${formatCountdown(expiryTimestamp)}</span>
    </div>
  `;
}

function expireOldReservations(){
  const now = Date.now();
  let changed = false;

  reservations.forEach(r => {
    if((r.status === 'pending' || r.status === 'confirmed') && r.expiresAt && r.expiresAt <= now){
      r.status = 'cancelled';
      r.expiresAt = null;
      changed = true;
    }
  });

  units.forEach(u => {
    if(u.status === 'reserved' && u.expiresAt && u.expiresAt <= now){
      u.status = 'available';
      u.expiresAt = null;
      changed = true;
    }
    if(u.status !== 'reserved' && u.expiresAt){
      u.expiresAt = null;
    }
  });

  if(changed){
    saveUnits();
    saveReservations();
  }
}

function renderCustomerGrid(){
  const grid = document.getElementById('customerGrid');
  grid.innerHTML = units.map(u => `
    <div class="card status-${u.status}">
      <div class="culm-bar"></div>
      <div class="body">
        <div class="unit-art">
          <img src="${generateUnitArtwork(u)}" alt="${u.name} preview" />
        </div>
        <div class="top-row">
          <div><h3>${u.name}</h3><div class="type">${u.type} - up to ${u.capacity}</div></div>
          <span class="badge status-${u.status}">${statusLabel(u.status)}</span>
        </div>
        <div class="meta">P${u.price} <span style="opacity:0.6">/ slot</span></div>
        ${u.status === 'reserved' ? getExpiryMarkup(u.expiresAt) : ''}
        <div class="actions">
          <button class="btn btn-primary btn-sm" ${u.status==='available' ? '' : 'disabled'} onclick="openBooking('${u.id}')">
            ${u.status==='available' ? 'Reserve Now' : 'Unavailable'}
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
        ${r.expiresAt ? `<div class="meta" style="color:#7d4d0a; font-size:0.75rem; font-weight:600;">Expires: ${formatExpiryTime(r.expiresAt)} • ${formatCountdown(r.expiresAt)}</div>` : ''}
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
        <div class="unit-art">
          <img src="${generateUnitArtwork(u)}" alt="${u.name} preview" />
        </div>
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
        ${r.status==='pending' ? `<button class="btn btn-sm btn-available" onclick="updateReservation('${r.id}','confirmed')">Confirm Booking</button>` : ''}
        ${(r.status==='pending'||r.status==='confirmed') ? `<button class="btn btn-sm btn-ghost" onclick="updateReservation('${r.id}','checked-in')">Check In</button>` : ''}
        ${r.status==='checked-in' ? `<button class="btn btn-sm btn-ghost" onclick="updateReservation('${r.id}','checked-out')">Check Out</button>` : ''}
        ${(r.status!=='cancelled' && r.status!=='checked-out') ? `<button class="btn btn-sm btn-occupied" onclick="updateReservation('${r.id}','cancelled')">Cancel</button>` : ''}
      </td>
    </tr>
  `).join('');
}
function statusBadgeClass(s){
  if(s==='checked-in') return 'occupied';
  if(s==='pending' || s==='confirmed') return 'reserved';
  if(s==='checked-out' || s==='cancelled') return 'available';
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
