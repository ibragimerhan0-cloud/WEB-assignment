"use strict";
// Assignment 4: All JavaScript components are initialized only when present.
const clock = document.getElementById('aura-clock');
if (clock) {
  function updateClock() {
    clock.textContent = new Date().toLocaleString('en-US', {
      year:'numeric', month:'long', day:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// Task 3: Popup subscription form
const overlay = document.getElementById('subscribe-overlay');
if (overlay) {
  const open = document.getElementById('subscribe-open');
  const close = document.getElementById('subscribe-close');
  const form = document.getElementById('subscribe-form');
  const feedback = document.getElementById('subscribe-feedback');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function showPopup() { overlay.hidden = false; document.body.style.overflow='hidden'; close.focus(); }
  function hidePopup() { overlay.hidden = true; document.body.style.overflow=''; open.focus(); }
  open.addEventListener('click', showPopup);
  close.addEventListener('click', hidePopup);
  overlay.addEventListener('click', e => { if (e.target === overlay) hidePopup(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) hidePopup();
    if (e.key === 'Tab' && !overlay.hidden) {
      const focusable = [...overlay.querySelectorAll('button,input')];
      const first = focusable[0], last = focusable[focusable.length-1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('subscriber-name').value.trim();
    const email = document.getElementById('subscriber-email').value.trim();
    feedback.className = 'mt-3 aura-error';
    if (!name || !email) feedback.textContent = 'Please fill in all fields.';
    else if (!emailPattern.test(email)) feedback.textContent = 'Please enter a valid email address.';
    else { feedback.className = 'mt-3 aura-success'; feedback.textContent = `Thank you, ${name}! Your input passed validation. (Demo only: no subscription was sent.)`; form.reset(); }
  });
}

// Task 2: Accordion with smooth open/close transitions
for (const button of document.querySelectorAll('.aura-question')) {
  const answer = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(opening));
    button.querySelector('span').textContent = opening ? '−' : '+';
    if (opening) { answer.hidden = false; requestAnimationFrame(() => answer.classList.add('is-open')); }
    else { answer.classList.remove('is-open'); setTimeout(() => { if (!answer.classList.contains('is-open')) answer.hidden = true; }, 300); }
  });
}

// Task 4: Cycle through warm background colors
const colorButton = document.getElementById('change-background');
if (colorButton) {
  const colors = ['#F9F6F0','#F1E4D3','#E7EFE3','#F8E8E5'];
  let index = 0;
  document.body.style.transition = 'background-color .4s ease';
  colorButton.addEventListener('click', () => { index = (index+1)%colors.length; document.body.style.backgroundColor = colors[index]; });
}

// Task 1: Validate required fields, email, password length and confirmation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const password = document.getElementById('contact-password').value;
    const confirmation = document.getElementById('contact-confirm').value;
    const errors = [];
    if (!name) errors.push('Name is required.');
    if (!email) errors.push('Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email address.');
    if (!message) errors.push('Message is required.');
    if (password.length < 8) errors.push('Password must contain at least 8 characters.');
    if (password !== confirmation) errors.push('Passwords do not match.');
    const feedback = document.getElementById('contact-errors');
    feedback.replaceChildren();
    feedback.className = 'aura-feedback ' + (errors.length ? 'aura-error' : 'aura-success');
    if (errors.length) {
      const list = document.createElement('ul');
      for (const error of errors) { const item = document.createElement('li'); item.textContent = error; list.appendChild(item); }
      feedback.appendChild(list);
    } else {
      feedback.textContent = 'All fields are valid! Demo only: your message was not sent or stored.';
      contactForm.reset();
    }
  });
}
