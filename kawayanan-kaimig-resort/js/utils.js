/* ---------------- Small helpers: codes, dates, demo password hash ---------------- */
function genCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for(let i=0;i<5;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return 'KKR-' + s;
}
function todayISO(){ return new Date().toISOString().slice(0,10); }

/* Lightweight, NON-cryptographic hash - good enough for this demo only.
   A real system must use a proper backend with salted password hashing. */
function simpleHash(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) >>> 0; }
  return h.toString(16);
}
