async function loadSite() {
  try {
    const response = await fetch('data/site.json?v=20260930-party-registration');
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return {};
  }
}

function connectRegistrationLink(selector, url, unavailableMessage) {
  const link = document.querySelector(selector);
  if (!link) return;
  if (url) {
    link.href = url;
    return;
  }
  link.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#registration-link-status').textContent = unavailableMessage;
  });
}

async function init() {
  const site = await loadSite();
  connectRegistrationLink('[data-student-registration]', site.studentRegistrationFormUrl, 'University registration is being connected. Please check back shortly.');
  connectRegistrationLink('[data-nonstudent-registration]', site.nonStudentRegistrationFormUrl, 'Non-student registration is being connected. Please check back shortly.');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);
