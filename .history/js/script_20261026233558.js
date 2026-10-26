"use strict";

// 1. Simple sound effect using Web Audio API (no external mp3 needed)
function playSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 600;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
}

// 2. Day / Night Theme Toggle (Dynamic Style Changes)
const themeBtn = document.getElementById("theme-toggle-btn");
if (themeBtn) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeBtn.textContent = "Light Mode";
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
        localStorage.setItem("theme", isDark ? "dark" : "light");
        playSound();
    });
}

// 3. Keyboard Navigation for Navbar Links (Arrow Left / Arrow Right)
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
navLinks.forEach((link, index) => {
    link.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            navLinks[(index + 1) % navLinks.length].focus();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            navLinks[(index - 1 + navLinks.length) % navLinks.length].focus();
        }
    });
});

// 4. Home Page: Live Clock, Time of Day Greeting (Switch), and Show Time Button
const clock = document.getElementById("aura-clock");
if (clock) {
    function updateClock() {
        clock.textContent = new Date().toLocaleString("en-US", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
    }
    updateClock();
    setInterval(updateClock, 1000);
}

const greetingEl = document.getElementById("greeting");
if (greetingEl) {
    const hour = new Date().getHours();
    let period = "evening";
    if (hour < 12) period = "morning";
    else if (hour < 18) period = "afternoon";

    switch (period) {
        case "morning":
            greetingEl.textContent = "Good morning! Start your day with fresh coffee.";
            break;
        case "afternoon":
            greetingEl.textContent = "Good afternoon! Time for a coffee break.";
            break;
        default:
            greetingEl.textContent = "Good evening! Relax with a warm cup at Aura.";
    }
}

const timeBtn = document.getElementById("time-button");
const timeDisplay = document.getElementById("time-display");
if (timeBtn && timeDisplay) {
    timeBtn.addEventListener("click", () => {
        timeDisplay.textContent = "Current time: " + new Date().toLocaleTimeString();
        playSound();
    });
}

// 5. Subscribe Popup Modal (Home Page)
const overlay = document.getElementById("subscribe-overlay");
if (overlay) {
    const openBtn = document.getElementById("subscribe-open");
    const closeBtn = document.getElementById("subscribe-close");
    const subForm = document.getElementById("subscribe-form");
    const feedback = document.getElementById("subscribe-feedback");

    openBtn.addEventListener("click", () => {
        overlay.hidden = false;
        playSound();
    });

    closeBtn.addEventListener("click", () => {
        overlay.hidden = true;
    });

    subForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("subscriber-name").value.trim();
        const email = document.getElementById("subscriber-email").value.trim();

        if (!name || !email.includes("@")) {
            feedback.className = "mt-3 aura-error";
            feedback.textContent = "Please enter your name and a valid email.";
        } else {
            feedback.className = "mt-3 aura-success";
            feedback.textContent = "Thank you, " + name + "! You are subscribed.";
            subForm.reset();
            playSound();
        }
    });
}

// 6. Menu Page: Objects & Methods, Arrays, Loops, Filter (HOF), Switch & Star Rating
const menuContainer = document.getElementById("dynamic-menu-container");
if (menuContainer) {
    const menuItems = [
        {
            id: 1,
            name: "Salted Caramel Latte",
            category: "hot",
            price: "1500 ₸",
            desc: "Our signature homemade caramel sauce balanced with sea salt and fresh espresso.",
            img: "images/latte-art.jpg",
            getInfo: function () { return this.category.toUpperCase() + " • " + this.price; }
        },
        {
            id: 2,
            name: "V60 Pour Over",
            category: "hot",
            price: "1400 ₸",
            desc: "For those who appreciate the pure, delicate notes of single-origin coffee.",
            img: "images/gallery-v60.jpg",
            getInfo: function () { return this.category.toUpperCase() + " • " + this.price; }
        },
        {
            id: 3,
            name: "Matcha Green Tea",
            category: "hot",
            price: "1600 ₸",
            desc: "Premium ceremonial grade matcha directly from Japan, whisked to perfection.",
            img: "images/gallery-matcha.jpg",
            getInfo: function () { return this.category.toUpperCase() + " • " + this.price; }
        },
        {
            id: 4,
            name: "Iced Cold Brew",
            category: "cold",
            price: "1500 ₸",
            desc: "Steeped for 18 hours for a smooth, refreshing taste over ice.",
            img: "images/gallery-cold-brew.jpg",
            getInfo: function () { return this.category.toUpperCase() + " • " + this.price; }
        }
    ];

    function renderMenu(filterType) {
        let filtered = [];

        // Switch statement + Higher-Order Function (.filter)
        switch (filterType) {
            case "hot":
                filtered = menuItems.filter(item => item.category === "hot");
                break;
            case "cold":
                filtered = menuItems.filter(item => item.category === "cold");
                break;
            default:
                filtered = menuItems;
        }

        menuContainer.innerHTML = "";

        // For loop to build cards from the array
        for (let i = 0; i < filtered.length; i++) {
            const item = filtered[i];
            menuContainer.innerHTML += `
                <div class="col-lg-6 col-md-6">
                    <div class="card h-100 shadow-sm border-0 menu-card">
                        <img src="${item.img}" class="card-img-top card-img-custom" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${item.name}</h5>
                            <p class="small fw-bold text-muted mb-2">${item.getInfo()}</p>
                            <p class="card-text text-muted">${item.desc}</p>
                            <div class="star-group" data-id="${item.id}">
                                <span class="star" data-val="1">★</span>
                                <span class="star" data-val="2">★</span>
                                <span class="star" data-val="3">★</span>
                                <span class="star" data-val="4">★</span>
                                <span class="star" data-val="5">★</span>
                            </div>
                            <small class="rating-text text-muted">Click a star to rate</small>
                        </div>
                    </div>
                </div>
            `;
        }

        setupStars();
    }

    function setupStars() {
        const allStars = document.querySelectorAll(".star");
        allStars.forEach(star => {
            star.addEventListener("click", () => {
                const rating = Number(star.getAttribute("data-val"));
                const group = star.parentElement;
                const starsInCard = group.querySelectorAll(".star");

                for (let i = 0; i < starsInCard.length; i++) {
                    if (i < rating) {
                        starsInCard[i].classList.add("active");
                    } else {
                        starsInCard[i].classList.remove("active");
                    }
                }

                // Update text and animate card using style.transform
                const text = group.nextElementSibling;
                text.textContent = "Your rating: " + rating + " / 5";

                const card = group.closest(".menu-card");
                card.style.transform = "scale(1.03)";
                setTimeout(() => {
                    card.style.transform = "scale(1)";
                }, 250);

                playSound();
            });
        });
    }

    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderMenu(btn.getAttribute("data-category"));
            playSound();
        });
    });

    renderMenu("all");
}

const printBtn = document.getElementById("print-btn");
if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
}

// 7. About Page: Simple FAQ Accordion
const faqButtons = document.querySelectorAll(".aura-question");
faqButtons.forEach(button => {
    button.addEventListener("click", () => {
        const answer = document.getElementById(button.getAttribute("aria-controls"));
        const isHidden = answer.hidden;
        answer.hidden = !isHidden;
        button.querySelector("span").textContent = isHidden ? "−" : "+";
        playSound();
    });
});

// 8. Contact Page: Async Form Submit with Callback & Reset Button
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    const feedback = document.getElementById("contact-errors");
    const resetBtn = document.getElementById("reset-form-btn");

    // Callback function to handle response
    function handleServerResponse(isSuccess, userName) {
        if (isSuccess) {
            feedback.className = "aura-feedback aura-success";
            feedback.textContent = "Thank you, " + userName + "! Your message was sent.";
            contactForm.reset();
            playSound();
        } else {
            feedback.className = "aura-feedback aura-error";
            feedback.textContent = "Error sending message. Please try again.";
        }
    }

    function sendFormAsync(data, callback) {
        fetch("https://httpbin.org/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => {
                callback(response.ok, data.name);
            })
            .catch(() => {
                callback(false, data.name);
            });
    }

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email.includes("@") || !message) {
            feedback.className = "aura-feedback aura-error";
            feedback.textContent = "Please fill in your name, valid email, and message.";
            return;
        }

        feedback.className = "aura-feedback";
        feedback.textContent = "Sending...";
        sendFormAsync({ name: name, email: email, message: message }, handleServerResponse);
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.querySelectorAll('#contact-form input[type="text"], #contact-form input[type="email"], #contact-form textarea')
                .forEach(input => input.value = "");
            feedback.textContent = "";
            playSound();
        });
    }
}