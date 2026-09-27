/* ---------------- Config, seed data and shared in-memory state ---------------- */
const UNITS_KEY = 'kkr_units_v1';
const RES_KEY = 'kkr_reservations_v1';
const USERS_KEY = 'kkr_users_v1';
const ADMIN_CODE = '1234';

const DEFAULT_UNITS = [
  {id:'c1', name:'Kawayan Nook', type:'Cottage', capacity:4, price:800, status:'available'},
  {id:'c2', name:'Buho Cabin', type:'Cottage', capacity:6, price:1200, status:'available'},
  {id:'c3', name:'Sawali Cottage', type:'Cottage', capacity:6, price:1200, status:'reserved'},
  {id:'c4', name:'Tikog Family House', type:'Cottage', capacity:10, price:2200, status:'occupied'},
  {id:'c5', name:'Payag Riverside', type:'Cottage', capacity:4, price:900, status:'available'},
  {id:'c6', name:'Bahay Kubo Deluxe', type:'Cottage', capacity:8, price:1800, status:'available'},
  {id:'p1', name:'KaiMig Lagoon Pool', type:'Pool', capacity:30, price:150, status:'available'},
  {id:'p2', name:'Sunburst Adult Pool', type:'Pool', capacity:20, price:150, status:'reserved'},
  {id:'p3', name:'Tadpole Kiddie Pool', type:'Pool', capacity:15, price:100, status:'available'}
];

let units = [];
let reservations = [];
let users = [];
let currentUser = null; // in-memory session only - clears on page reload
let currentBookingUnit = null;
let pendingReserveAfterLogin = null;
