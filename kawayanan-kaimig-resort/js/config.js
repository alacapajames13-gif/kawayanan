/* ---------------- Config, seed data and shared in-memory state ---------------- */
const UNITS_KEY = 'kkr_units_v1';
const RES_KEY = 'kkr_reservations_v1';
const USERS_KEY = 'kkr_users_v1';
const ADMIN_CODE = '1234';
const HOLD_MINUTES = 30;

const DEFAULT_UNITS = [
  {id:'c1', name:'Kawayan Nook', type:'Cottage', capacity:4, price:800, status:'available', expiresAt:null, photo:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'},
  {id:'c2', name:'Buho Cabin', type:'Cottage', capacity:6, price:1200, status:'available', expiresAt:null, photo:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'},
  {id:'c3', name:'Sawali Cottage', type:'Cottage', capacity:6, price:1200, status:'reserved', expiresAt: Date.now() + HOLD_MINUTES * 60 * 1000, photo:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'},
  {id:'c4', name:'Tikog Family House', type:'Cottage', capacity:10, price:2200, status:'occupied', expiresAt:null, photo:'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80'},
  {id:'c5', name:'Payag Riverside', type:'Cottage', capacity:4, price:900, status:'available', expiresAt:null, photo:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80'},
  {id:'c6', name:'Bahay Kubo Deluxe', type:'Cottage', capacity:8, price:1800, status:'available', expiresAt:null, photo:'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80'},
  {id:'p1', name:'KaiMig Lagoon Pool', type:'Pool', capacity:30, price:150, status:'available', expiresAt:null, photo:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'},
  {id:'p2', name:'Sunburst Adult Pool', type:'Pool', capacity:20, price:150, status:'reserved', expiresAt: Date.now() + HOLD_MINUTES * 60 * 1000, photo:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80'},
  {id:'p3', name:'Tadpole Kiddie Pool', type:'Pool', capacity:15, price:100, status:'available', expiresAt:null, photo:'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80'}
];

let units = [];
let reservations = [];
let users = [];
let currentUser = null; // in-memory session only - clears on page reload
let currentBookingUnit = null;
let pendingReserveAfterLogin = null;
