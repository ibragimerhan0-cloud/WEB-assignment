"use strict";

/* =========================================================
   HELPERS
   ========================================================= */

// Shared audio context, created on the first sound (browsers need a user click first)
let audioCtx = null;
let lastSoundTime = 0;

// Plays a short beep. Calls that come too fast are skipped so sounds never overlap.
function playSound(frequency = 660, duration = 0.12) {
  const now = Date.now();
  if (now - lastSoundTime < 150) return;
  lastSoundTime = now;

  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (error) {
    // Sound is not supported in this browser; the page still works
  }
}

/* =========================================================
   ASSIGNMENT 4 CODE (kept, with a sound added on success)
   ========================================================= */

// Live clock on the home page
const clock = document.getElementById('aura-clock');
if (clock) {
  function updateClock() {
    clock.textContent = new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// Subscribe popup
const overlay = document.getElementById('subscribe-overlay');
if (overlay) {
  const open = document.getElementById('subscribe-open');
  const close = document.getElementById('subscribe-close');
  const form = document.getElementById('subscribe-form');
  const feedback = document.getElementById('subscribe-feedback');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showPopup() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function hidePopup() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    open.focus();
  }

  open.addEventListener('click', showPopup);
  close.addEventListener('click', hidePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subscriber-name').value.trim();
    const email = document.getElementById('subscriber-email').value.trim();
    feedback.className = 'mt-3 aura-error';

    if (!name || !email) {
      feedback.textContent = 'Please fill in all fields.';
    } else if (!emailPattern.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
    } else {
      feedback.className = 'mt-3 aura-success';
      feedback.textContent = `Thank you, ${name}! (Demo only)`;
      playSound(880, 0.2);
      form.reset();
    }
  });
}

// FAQ accordion
for (const button of document.querySelectorAll('.aura-question')) {
  const answer = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(opening));
    button.querySelector('span').textContent = opening ? '−' : '+';

    if (opening) {
      answer.hidden = false;
      requestAnimationFrame(() => answer.classList.add('is-open'));
    } else {
      answer.classList.remove('is-open');
      setTimeout(() => {
        if (!answer.classList.contains('is-open')) answer.hidden = true;
      }, 300);
    }
  });
}

// Background colour changer (menu page)
const colorButton = document.getElementById('change-background');
if (colorButton) {
  const colors = ['#F9F6F0', '#F1E4D3', '#E7EFE3', '#F8E8E5'];
  let colorIndex = 0;
  colorButton.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.backgroundColor = colors[colorIndex];
    playSound(330, 0.08);
  });
}

// Print button (moved here from the HTML onclick attribute)
const printButton = document.getElementById('print-menu-btn');
if (printButton) {
  printButton.addEventListener('click', () => window.print());
}

/* =========================================================
   ASSIGNMENT 5: ADVANCED JS & DOM MANIPULATION
   ========================================================= */

// 1. Day / Night theme toggle (DOM manipulation + classes)
const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    playSound(isDark ? 520 : 440, 0.1);
  });
}

// 2. Keyboard navigation on the navbar (keydown + focus)
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach((link, index) => {
  link.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navLinks[(index + 1) % navLinks.length].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navLinks[(index - 1 + navLinks.length) % navLinks.length].focus();
    }
  });
});

// 3. Menu: objects, arrays, loops, map/filter, switch, rating stars
const dynamicMenuContainer = document.getElementById('dynamic-menu-container');
const filterButtons = document.querySelectorAll('.filter-btn');

if (dynamicMenuContainer && filterButtons.length > 0) {
  // Object that holds the menu data and the logic for showing it
  const menu = {
    // Array of objects with the menu data
    items: [
      { id: 1, name: 'Salted Caramel Latte', type: 'hot', desc: 'Homemade caramel sauce balanced with sea salt.', img: 'images/latte-art.jpg' },
      { id: 2, name: 'V60 Pour Over', type: 'hot', desc: 'Pure, delicate notes of single-origin coffee.', img: 'images/gallery-v60.jpg' },
      { id: 3, name: 'Matcha Green Tea', type: 'hot', desc: 'Premium ceremonial grade matcha from Japan.', img: 'images/gallery-matcha.jpg' },
      { id: 4, name: 'Cold Brew', type: 'cold', desc: 'Steeped for 18 hours for a perfectly smooth finish.', img: 'images/gallery-cold-brew.jpg' }
    ],

    // Stores each drink's rating, e.g. { 1: 4, 3: 5 }
    ratings: {},

    // Returns the items for a category (switch statement)
    filter(category) {
      switch (category) {
        case 'hot':
          return this.items.filter(item => item.type === 'hot');
        case 'cold':
          return this.items.filter(item => item.type === 'cold');
        default:
          return this.items;
      }
    },

    // Builds the cards from a list of items (map + template strings)
    render(list) {
      dynamicMenuContainer.innerHTML = list.map(item => {
        const rating = this.ratings[item.id] || 0;
        const stars = [1, 2, 3, 4, 5]
          .map(value => `<span class="star ${value <= rating ? 'selected' : ''}" data-value="${value}">★</span>`)
          .join('');
        const ratingText = rating ? `You rated this ${rating}/5` : 'Tap a star to rate';

        return `
          <div class="col-lg-6 col-md-6">
            <div class="card h-100 shadow-sm border-0 menu-item-card" id="card-${item.id}">
              <img src="${item.img}" class="card-img-top menu-item-img" alt="${item.name}">
              <div class="card-body">
                <h5 class="card-title fw-bold">${item.name}</h5>
                <p class="card-text text-muted">${item.desc}</p>
                <div class="star-rating" data-id="${item.id}">${stars}</div>
                <span class="rating-text">${ratingText}</span>
              </div>
            </div>
          </div>`;
      }).join('');
    },

    // Saves a rating, updates the stars, text, sound and animation
    rate(id, value) {
      this.ratings[id] = value;

      const card = document.getElementById(`card-${id}`);
      card.querySelectorAll('.star').forEach(star => {
        star.classList.toggle('selected', Number(star.dataset.value) <= value);
      });
      card.querySelector('.rating-text').textContent = `You rated this ${value}/5`;

      playSound(660);
      card.classList.add('scale-animation');
      setTimeout(() => card.classList.remove('scale-animation'), 300);
    }
  };

  // Event delegation: one listener handles every star, even after re-rendering
  dynamicMenuContainer.addEventListener('click', (event) => {
    const star = event.target.closest('.star');
    if (!star) return;
    const id = Number(star.closest('.star-rating').dataset.id);
    menu.rate(id, Number(star.dataset.value));
  });

  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      menu.render(menu.filter(button.dataset.category));
    });
  });

  // Initial state: show all drinks, with "All Drinks" highlighted
  document.querySelector('[data-category="all"]').classList.add('active');
  menu.render(menu.items);
}

// 4. Contact form: validation, reset, and asynchronous fetch POST with callbacks
const contactForm = document.getElementById('contact-form');
const resetBtn = document.getElementById('reset-form-btn');
const formFeedback = document.getElementById('contact-errors');

// Demo endpoint that accepts POST requests and returns a fake id
const CONTACT_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

// Sends data with fetch. Calls onSuccess or onError when finished.
function sendContactForm(data, onSuccess, onError) {
  fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw new Error(`server responded with ${response.status}`);
      return response.json();
    })
    .then(onSuccess)
    .catch(onError);
}

if (contactForm) {
  // Reset button: clears all fields and messages
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      formFeedback.replaceChildren();
      playSound(300, 0.08);
    });
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const password = document.getElementById('contact-password').value;
    const confirmation = document.getElementById('contact-confirm').value;

    // Validation
    const errors = [];
    if (!name) errors.push('Name is required.');
    if (!email) errors.push('Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email address.');
    if (!message) errors.push('Message is required.');
    if (password.length < 8) errors.push('Password must contain at least 8 characters.');
    if (password !== confirmation) errors.push('Passwords do not match.');

    formFeedback.replaceChildren();

    if (errors.length) {
      formFeedback.className = 'aura-feedback aura-error';
      const list = document.createElement('ul');
      for (const error of errors) {
        const item = document.createElement('li');
        item.textContent = error;
        list.appendChild(item);
      }
      formFeedback.appendChild(list);
      return;
    }

    // Send the message (the password is never sent)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const payload = {
      name,
      email,
      inquiryType: document.getElementById('inquiry-type').value,
      contactMethod: contactForm.querySelector('input[name="contact-method"]:checked').value,
      newsletter: document.getElementById('newsletter').checked,
      message
    };

    // Callbacks handle the response once fetch finishes
    const finish = () => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    };

    sendContactForm(
      payload,
      (result) => {
        formFeedback.className = 'aura-feedback aura-success';
        formFeedback.textContent = `Thank you, ${name}! Your message was sent (reference #${result.id}).`;
        contactForm.reset();
        playSound(880, 0.2);
        finish();
      },
      (error) => {
        formFeedback.className = 'aura-feedback aura-error';
        formFeedback.textContent = `Sending failed (${error.message}). Please try again.`;
        finish();
      }
    );
  });
}