// bookingSession.js
// TC3  — persists user selections across booking step navigation
// TC11 — survives accidental page refresh via sessionStorage

const KEY = 'airwings_booking';

export function saveBooking(data) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    console.warn('Could not save booking to session');
  }
}

export function loadBooking() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearBooking() {
  sessionStorage.removeItem(KEY);
}

export function updateBooking(partial) {
  const current = loadBooking() || {};
  saveBooking({ ...current, ...partial });
}