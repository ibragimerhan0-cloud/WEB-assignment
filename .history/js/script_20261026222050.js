"use strict";

// --- ASSIGNMENT 4 CODE (Preserved) ---
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
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('subscriber-name').value.trim();
    const email = document.getElementById('subscriber-email').value.trim();
    feedback.className = 'mt-3 aura-error';
    if (!name || !email) feedback.textContent = 'Please fill in all fields.';
    else if (!emailPattern.test(email)) feedback.textContent = 'Please enter a valid email address.';
    else { feedback.className = 'mt-3 aura-success'; feedback.textContent = `Thank you, ${name}! (Demo only)`; form.reset(); }
  });
}

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

const colorButton = document.getElementById('change-background');
if (colorButton) {
  const colors = ['#F9F6F0','#F1E4D3','#E7EFE3','#F8E8E5'];
  let index = 0;
  colorButton.addEventListener('click', () => { index = (index+1)%colors.length; document.body.style.backgroundColor = colors[index]; });
}


// ==========================================
// ASSIGNMENT 5: ADVANCED JS & DOM MANIPULATION
// ==========================================

// 1. DOM Manipulation & Styling: Day/Night Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggleBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
}

// 2. Event Handling: Keyboard Navigation on Navbar
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (index + 1) % navLinks.length;
            navLinks[next].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (index - 1 + navLinks.length) % navLinks.length;
            navLinks[prev].focus();
        }
    });
});

// 3. Arrays, Objects & Higher-Order Functions: Dynamic Menu Filtering
const dynamicMenuContainer = document.getElementById('dynamic-menu-container');
const filterButtons = document.querySelectorAll('.filter-btn');

if (dynamicMenuContainer && filterButtons.length > 0) {
    // Array of Objects storing menu data
    const menuItems = [
        { id: 1, name: 'Salted Caramel Latte', type: 'hot', desc: 'Homemade caramel sauce balanced with sea salt.', img: 'images/latte-art.jpg' },
        { id: 2, name: 'V60 Pour Over', type: 'hot', desc: 'Pure, delicate notes of single-origin coffee.', img: 'images/gallery-v60.jpg' },
        { id: 3, name: 'Matcha Green Tea', type: 'hot', desc: 'Premium ceremonial grade matcha from Japan.', img: 'images/gallery-matcha.jpg' },
        { id: 4, name: 'Cold Brew', type: 'cold', desc: 'Steeped for 18 hours for a perfectly smooth finish.', img: 'images/gallery-cold-brew.jpg' }
    ];

    const starSound = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3'); // Sound effect

    // Function to render items using HOF (map)
    function renderMenu(items) {
        dynamicMenuContainer.innerHTML = items.map(item => `
            <div class="col-lg-6 col-md-6">
                <div class="card h-100 shadow-sm border-0 menu-item-card" id="card-${item.id}" style="transition: transform 0.3s ease;">
                    <img src="${item.img}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${item.name}</h5>
                        <p class="card-text text-muted">${item.desc}</p>
                        <div class="star-rating" data-id="${item.id}">
                            <span class="star" data-value="1">★</span>
                            <span class="star" data-value="2">★</span>
                            <span class="star" data-value="3">★</span>
                            <span class="star" data-value="4">★</span>
                            <span class="star" data-value="5">★</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Attribute Manipulation & Animation: Interactive Stars
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                const value = parseInt(e.target.getAttribute('data-value'));
                const parent = e.target.parentElement;
                const cardId = parent.getAttribute('data-id');
                
                // Color change based on rating
                Array.from(parent.children).forEach(s => {
                    s.classList.toggle('selected', parseInt(s.getAttribute('data-value')) <= value);
                });
                
                // Trigger Sound & Animation
                starSound.currentTime = 0;
                starSound.play().catch(() => {}); // Catch error if browser blocks autoplay
                
                const card = document.getElementById(`card-${cardId}`);
                card.classList.add('scale-animation');
                setTimeout(() => card.classList.remove('scale-animation'), 300);
            });
        });
    }

    renderMenu(menuItems); // Initial render

    // Event Handling with Switch Statement
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            let filtered = [];
            switch (category) {
                case 'hot':
                    filtered = menuItems.filter(item => item.type === 'hot');
                    break;
                case 'cold':
                    filtered = menuItems.filter(item => item.type === 'cold');
                    break;
                default: // 'all'
                    filtered = menuItems;
            }
            renderMenu(filtered);
        });
    });
}

// 4. Event Handling & Callbacks: Form Validation, Reset & Async Submit
const contactForm = document.getElementById('contact-form');
const resetBtn = document.getElementById('reset-form-btn'); 

if (contactForm) {
    // DOM Manipulation: Reset form fields directly
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea').forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') input.checked = false;
                else input.value = '';
            });
            document.getElementById('contact-errors').replaceChildren();
        });
    }

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
            for (const error of errors) { 
                const item = document.createElement('li'); 
                item.textContent = error; 
                list.appendChild(item); 
            }
            feedback.appendChild(list);
        } else {
            // HOF Callback implementation for asynchronous submission simulation
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending securely...';
            submitBtn.disabled = true;

            function processAsyncSubmit(callback) {
                setTimeout(() => {
                    callback();
                }, 1500); // Simulate network delay
            }

            processAsyncSubmit(() => {
                feedback.textContent = 'Success! Your data was submitted asynchronously without reloading.';
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }
    });
}