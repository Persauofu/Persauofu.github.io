const $ = selector => document.querySelector(selector);
let site = {};
let events = [];

async function load(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return fallback;
  }
}

function selectedEvent() {
  return events.find(item => item.id === $('#event-select').value);
}

function updateEvent() {
  const event = selectedEvent();
  const box = $('#event-summary');
  if (!event) {
    box.textContent = 'Choose an event to see details.';
    return;
  }
  const date = event.date
    ? new Date(`${event.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  box.innerHTML = `<strong>${event.title}</strong><span>${date} · ${event.time}</span><span>${event.location}</span><span>Ticket: ${event.price}</span>`;
  const url = new URL(location.href);
  url.searchParams.set('event', event.id);
  history.replaceState({}, '', url);
}

function ticketPrice() {
  return $('#ticket-type').value === 'student' ? 20 : 30;
}

function renderGuestFields() {
  const quantity = Number($('#ticket-quantity').value || 0);
  const container = $('#guest-fields');
  container.innerHTML = '';
  for (let number = 2; number <= quantity; number += 1) {
    const label = document.createElement('label');
    label.innerHTML = `Guest ${number - 1} full name <small>(optional)</small><input name="guest${number - 1}" autocomplete="name" placeholder="Guest ${number - 1}">`;
    container.appendChild(label);
  }
}

function updateTotal() {
  const quantity = Number($('#ticket-quantity').value || 0);
  const total = quantity * ticketPrice();
  $('#ticket-total').hidden = !quantity;
  $('#ticket-total strong').textContent = `$${total}`;
  renderGuestFields();
}

function updateTicketOptions() {
  const type = $('#ticket-type').value;
  const isStudent = type === 'student';
  const hasType = type === 'student' || type === 'guest';
  $('#uid-field').hidden = !isStudent;
  $('#uid-input').required = isStudent;
  if (!isStudent) $('#uid-input').value = '';
  $('#quantity-field').hidden = !hasType;

  const quantity = $('#ticket-quantity');
  quantity.innerHTML = '';
  if (!hasType) {
    updateTotal();
    return;
  }
  const maximum = isStudent ? 2 : 10;
  for (let count = 1; count <= maximum; count += 1) {
    quantity.add(new Option(`${count} ticket${count > 1 ? 's' : ''} — $${count * ticketPrice()}`, String(count)));
  }
  $('#quantity-help').textContent = isStudent
    ? 'One student may purchase one or two tickets at $20 each.'
    : 'Purchase up to 10 non-student tickets at $30 each.';
  updateTotal();
}

function validateStudentId() {
  const input = $('#uid-input');
  if (!input.value) return;
  const normalized = input.value.trim().toLowerCase();
  const valid = /^u?\d{7}$/.test(normalized);
  input.setCustomValidity(valid ? '' : 'Enter a uNID as u followed by 7 digits, for example u1234567.');
  $('#uid-help').textContent = valid
    ? 'Format looks right. PERSA may manually verify student eligibility.'
    : 'Use the format u1234567. Never enter your password or Duo code.';
}

function continueToOfficialForm(event) {
  event.preventDefault();
  const chosen = selectedEvent();
  const status = $('#form-status');
  if (!chosen || chosen.id !== 'halloween-celebration') {
    status.textContent = chosen ? 'Registration for this event is not open yet.' : 'Please choose an event.';
    return;
  }
  validateStudentId();
  if (!event.currentTarget.reportValidity()) return;
  if (site.registrationFormUrl) {
    window.location.href = site.registrationFormUrl;
    return;
  }
  status.textContent = 'The secure registration form is being connected. Please check back shortly or email PERSA.';
}

async function init() {
  [site, events] = await Promise.all([
    load('data/site.json?v=20260930-order-flow', {}),
    load('data/events.json?v=20260930-order-flow', [])
  ]);
  const select = $('#event-select');
  events.filter(event => event.status !== 'hidden').forEach(event => {
    select.add(new Option(`${event.title} — ${event.date || 'Coming soon'}`, event.id));
  });
  const requested = new URLSearchParams(location.search).get('event') || 'halloween-celebration';
  if (events.some(event => event.id === requested)) select.value = requested;
  select.addEventListener('change', updateEvent);
  $('#ticket-type').addEventListener('change', updateTicketOptions);
  $('#ticket-quantity').addEventListener('change', updateTotal);
  $('#uid-input').addEventListener('input', validateStudentId);
  updateEvent();
  updateTicketOptions();
  $('#registration-form').addEventListener('submit', continueToOfficialForm);
  $('#year').textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);
