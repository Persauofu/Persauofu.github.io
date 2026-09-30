const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

async function getJSON(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Could not load ${path}`, error);
    return fallback;
  }
}

const fallbackSite = { email: '', instagram: '', telegram: '', campusConnect: '', venmoHandle: '' };

function safeLink(value, type) {
  if (!value) return '#';
  if (type === 'email' && !value.startsWith('mailto:')) return `mailto:${value}`;
  return value;
}

function configureLinks(site) {
  ['instagram', 'telegram', 'campusConnect', 'email'].forEach(key => {
    $$(`[data-link="${key}"]`).forEach(link => {
      const value = site[key];
      link.href = safeLink(value, key);
      if (!value) {
        link.classList.add('placeholder-link');
        link.title = `Add the ${key} link in data/site.json`;
        link.addEventListener('click', event => event.preventDefault());
      } else if (key !== 'email') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  });
}

function formatDate(dateString) {
  if (!dateString) return { day: 'TBA', month: '', full: 'Date TBA' };
  const value = new Date(`${dateString}T12:00:00`);
  return { day: value.toLocaleDateString('en-US', {day:'2-digit'}), month: value.toLocaleDateString('en-US', {month:'short'}), full: value.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'}) };
}

function renderEvents(events) {
  const grid = $('#event-grid');
  if (!grid) return;
  const upcoming = events.filter(event => event.status !== 'hidden').sort((a,b) => (a.date || '9999').localeCompare(b.date || '9999'));
  if (!upcoming.length) { grid.innerHTML = '<div class="empty-card">New events are on the way. Follow PERSA for announcements.</div>'; return; }
  grid.innerHTML = upcoming.map(event => {
    const date = formatDate(event.date);
    const imageStyle = event.image ? ` style="background-image:linear-gradient(180deg,rgba(20,21,35,.06),rgba(20,21,35,.93)),url('${event.image}')"` : '';
    return `<article class="event-card reveal ${event.featured ? 'featured' : ''}"${imageStyle}>
      <time class="event-date" datetime="${event.date}"><strong>${date.day}</strong>${date.month}</time>
      <p class="event-tag">${event.tag || 'Upcoming'}</p><p class="event-meta">${event.time} · ${event.price}</p>
      <h3>${event.title}</h3><p>${event.description}</p>
      <p class="event-meta">${event.location}</p>
      <a class="text-link" href="${event.registrationUrl || `registration.html?event=${event.id}`}">Register <span>→</span></a>
    </article>`;
  }).join('');
}

function renderTeam(team) {
  const grid = $('#team-grid'); if (!grid) return;
  grid.innerHTML = team.map(member => {
    const image = member.photo ? `<img src="${member.photo}" alt="Portrait of ${member.name}">` : `<div class="member-initial" aria-hidden="true">${member.name === 'Officer name' ? 'P' : member.name.slice(0,1)}</div>`;
    const contact = member.email ? `<a href="mailto:${member.email}" aria-label="Email ${member.name}">Email ↗</a>` : '<a href="#contact">Contact via PERSA ↗</a>';
    return `<article class="team-card reveal"><div class="member-photo">${image}</div><h3>${member.name}</h3><p>${member.role}</p>${contact}</article>`;
  }).join('');
}

function renderGallery(items) {
  const grid = $('#gallery-grid'); if (!grid) return;
  grid.innerHTML = items.map(item => `<figure class="gallery-card reveal"><div class="placeholder-art"><img src="${item.image}" alt="${item.alt || ''}" loading="lazy"></div><figcaption class="gallery-caption"><h3>${item.title}</h3><p>${item.caption}</p></figcaption></figure>`).join('');
}

// Approximate phonetic mapping to Old Persian Unicode signs.
const oldPersianMap = {
  a:'𐎠', b:'𐎲', c:'𐎨', d:'𐎭', e:'𐎡', f:'𐎳', g:'𐎥', h:'𐏃', i:'𐎡', j:'𐎩', k:'𐎣', l:'𐎼', m:'𐎶', n:'𐎴', o:'𐎢', p:'𐎱', q:'𐎤', r:'𐎼', s:'𐎿', t:'𐎫', u:'𐎢', v:'𐎺', w:'𐎺', x:'𐎧', y:'𐎹', z:'𐏀'
};
function convertName() {
  const input = $('#name-input'); const output = $('#cuneiform-output'); const translit = $('#transliteration-output');
  if (!input || !output) return;
  const normalized = input.value.trim().toLowerCase().replace(/sh/g,'š').replace(/ch/g,'č').replace(/kh/g,'x').replace(/gh/g,'q');
  const special = { 'š':'𐏁', 'č':'𐎨' };
  const signs = [...normalized].map(char => char === ' ' ? '   ' : (special[char] || oldPersianMap[char] || '')).filter(Boolean);
  output.textContent = signs.length ? signs.join(' ') : '𐎤 𐎢 𐎽 𐎢 𐏁';
  translit.textContent = normalized ? [...normalized].filter(c => /[a-zšč]/.test(c)).join('-') : 'k-u-r-u-sh';
}

function bindNavigation() {
  const menu = $('.menu-button'); const links = $('#nav-links');
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); links.classList.toggle('open', !open); });
  $$('#nav-links a').forEach(link => link.addEventListener('click', () => { links.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); }));
  window.addEventListener('scroll', () => $('.site-header')?.classList.toggle('scrolled', scrollY > 30), {passive:true});
}

function revealItems() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);} }), {threshold:.08});
  $$('.reveal').forEach(el => observer.observe(el));
}

async function init() {
  bindNavigation();
  const [site, events, team, gallery] = await Promise.all([
    getJSON('data/site.json?v=20260930-release', fallbackSite), getJSON('data/events.json?v=20260930-release', []), getJSON('data/team.json?v=20260930-release', []), getJSON('data/gallery.json?v=20260930-release', [])
  ]);
  configureLinks(site); renderEvents(events); renderTeam(team); renderGallery(gallery);
  $('#convert-button')?.addEventListener('click', convertName); $('#name-input')?.addEventListener('input', convertName); $('#name-input')?.addEventListener('keydown', e => {if(e.key === 'Enter') convertName();});
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
  requestAnimationFrame(revealItems);
}
document.addEventListener('DOMContentLoaded', init);
