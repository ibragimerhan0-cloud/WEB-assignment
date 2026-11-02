"use strict";

// Task 0. Run the code after the HTML is ready.
$(document).ready(function () {
    console.log("jQuery is ready!");

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
        osc.onended = () => ctx.close();
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
            showNotification(isDark ? "Dark mode enabled." : "Light mode enabled.");
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
                feedback.textContent = "Thank you, " + name + "! Your demo subscription is complete.";
                subForm.reset();
                showNotification("Demo subscription completed.");
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
                    <div class="col-lg-6 col-md-6 menu-item" data-name="${item.name}">
                        <div class="card h-100 shadow-sm border-0 menu-card">
                            <img src="images/placeholder.svg" data-src="${item.img}" class="card-img-top card-img-custom lazy-image" alt="${item.name}">
                            <div class="card-body">
                                <h5 class="card-title fw-bold menu-search-text">${item.name}</h5>
                                <p class="small fw-bold text-muted mb-2">${item.getInfo()}</p>
                                <p class="card-text text-muted menu-search-text">${item.desc}</p>
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
            filterMenu();
            updateSuggestions();
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
                    showNotification("Thank you! Your rating is " + rating + " / 5.");

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
            button.querySelector(".faq-icon").textContent = isHidden ? "−" : "+";
            button.setAttribute("aria-expanded", String(isHidden));
            updateScrollProgress();
            playSound();
        });
    });

    // Task 1. Real-time search through the currently selected menu category.
    function filterMenu() {
        const query = $("#menu-search").val().trim().toLowerCase();
        let count = 0;

        $(".menu-item").each(function () {
            const card = $(this);
            const text = card.find(".menu-search-text").text().toLowerCase();
            const matches = text.includes(query);
            card.toggle(matches);
            if (matches) count++;

            card.find(".menu-search-text").each(function () {
                highlightMatches($(this), query);
            });
        });

        $("#search-count").text(count + " drink(s) found");
        $("#no-results").prop("hidden", count > 0);
        loadLazyImages();
        updateScrollProgress();
    }

    $("#menu-search").on("input", function () {
        filterMenu();
        updateSuggestions();
    });

    // Task 2. Suggestions come from the names of the current category's drinks.
    function hideSuggestions() {
        $("#search-suggestions").hide();
        $("#menu-search").attr("aria-expanded", "false");
    }

    function updateSuggestions() {
        const query = $("#menu-search").val().trim().toLowerCase();
        const list = $("#search-suggestions").empty();

        if (query) {
            $(".menu-item").each(function () {
                const name = $(this).attr("data-name");
                if (name.toLowerCase().includes(query)) {
                    const button = $("<button>").attr("type", "button").text(name);
                    list.append($("<li>").append(button));
                }
            });
        }

        const hasSuggestions = list.children().length > 0;
        list.toggle(hasSuggestions);
        $("#menu-search").attr("aria-expanded", String(hasSuggestions));
    }

    $("#search-suggestions").on("click", "button", function () {
        $("#menu-search").val($(this).text()).trigger("focus");
        filterMenu();
        hideSuggestions();
    });

    $("#menu-search").on("focus", updateSuggestions).on("keydown", function (event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            updateSuggestions();
            $("#search-suggestions button").first().trigger("focus");
        } else if (event.key === "Escape") {
            hideSuggestions();
        }
    });

    $("#search-suggestions").on("keydown", "button", function (event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            $(this).parent().next().find("button").trigger("focus");
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            const previous = $(this).parent().prev().find("button");
            if (previous.length) previous.trigger("focus");
            else $("#menu-search").trigger("focus");
        } else if (event.key === "Escape") {
            $("#menu-search").trigger("focus");
            hideSuggestions();
        }
    });

    $(document).on("click focusin", function (event) {
        if (!$(event.target).closest("#menu-search-box").length) hideSuggestions();
    });

    // Task 3. Wrap every match in <mark>; keep the original text for the next search.
    // Text nodes keep typed symbols such as <, &, [ and * safe and literal.
    function highlightMatches(element, query) {
        let original = element.data("original-text");
        if (original === undefined) {
            original = element.text();
            element.data("original-text", original);
        }
        element.empty();
        if (!query) {
            element.text(original);
            return;
        }

        const lowerText = original.toLowerCase();
        let start = 0;
        let position = lowerText.indexOf(query, start);
        while (position !== -1) {
            element.append(document.createTextNode(original.slice(start, position)));
            element.append($("<mark>").text(original.slice(position, position + query.length)));
            start = position + query.length;
            position = lowerText.indexOf(query, start);
        }
        element.append(document.createTextNode(original.slice(start)));
    }

    $("#faq-search").on("input", function () {
        const query = $(this).val().trim().toLowerCase();
        $(".faq-text").each(function () {
            highlightMatches($(this), query);
        });
        $(".aura-question").each(function () {
            const button = $(this);
            const answer = $("#" + button.attr("aria-controls"));
            const matches = query !== "" && (button.find("mark").length > 0 || answer.find("mark").length > 0);
            answer.prop("hidden", !matches);
            button.attr("aria-expanded", String(matches));
            button.find(".faq-icon").text(matches ? "−" : "+");
        });
        const count = $(".aura-faq mark").length;
        $("#faq-search-status").text(query ? count + " match(es) found" : "");
        updateScrollProgress();
    });

    // Task 4. The bar shows how much of the scrollable page has been read.
    function updateScrollProgress() {
        const distance = $(document).height() - $(window).height();
        let percent = distance > 0 ? $(window).scrollTop() / distance * 100 : 0;
        percent = Math.max(0, Math.min(100, percent));
        $("#scroll-progress-bar").css("width", percent + "%");
    }

    // Shared by counters and lazy images.
    function isInViewport(element) {
        if (!element.is(":visible")) return false;
        const top = element.offset().top;
        const bottom = top + element.outerHeight();
        const windowTop = $(window).scrollTop();
        return top < windowTop + $(window).height() && bottom > windowTop;
    }

    // Task 5. Start each number once, when it becomes visible.
    function animateCounters() {
        $(".counter").each(function () {
            const counter = $(this);
            if (counter.data("counted") || !isInViewport(counter)) return;
            counter.data("counted", true);
            const target = Number(counter.attr("data-target"));

            $({ value: 0 }).animate({ value: target }, {
                duration: 1500,
                step: function (value) {
                    counter.text(Math.floor(value));
                },
                complete: function () {
                    counter.text(target);
                }
            });
        });
    }

    // Task 6. Validate the form, disable controls, then simulate a server call.
    function sendFormAsync(data, callback) {
        setTimeout(function () {
            callback(data.name);
        }, 1800);
    }

    $("#contact-form").on("submit", function (event) {
        event.preventDefault();
        const form = $(this);
        const button = $("#submit-message");
        const feedback = $("#contact-errors");
        if (button.prop("disabled")) return;

        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const message = $("#message").val().trim();
        if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.removeClass("aura-success").addClass("aura-error")
                .text("Please enter your name, a valid email, and a message.");
            return;
        }

        form.attr("aria-busy", "true");
        form.find("input, select, textarea, button").prop("disabled", true);
        button.html('<span class="aura-spinner" aria-hidden="true"></span> Please wait…');
        feedback.removeClass("aura-error aura-success").text("Processing your demo submission…");

        sendFormAsync({ name: name, email: email, message: message }, function (userName) {
            form[0].reset();
            form.find("input, select, textarea, button").prop("disabled", false);
            form.attr("aria-busy", "false");
            button.text("Send Message");
            feedback.addClass("aura-success").text("Thank you, " + userName + "! Demo submission completed.");
            showNotification("Demo form submitted successfully!");
            playSound();
        });
    });

    $("#reset-form-btn").on("click", function () {
        $("#contact-form")[0].reset();
        $("#contact-errors").text("").removeClass("aura-error aura-success");
        showNotification("Form cleared.");
    });

    // Task 7. Reuse one temporary toast for form, rating, theme and copy actions.
    function showNotification(message) {
        $("#aura-toast").stop(true, true).text(message)
            .fadeIn(200).delay(2400).fadeOut(400);
    }

    // Task 8. Copy contact text; show a checkmark and a tooltip after success.
    $(".copy-btn").on("click", function () {
        const button = $(this);
        const text = $(button.attr("data-copy-target")).text();
        const tooltip = button.siblings(".copy-tooltip");
        const originalIcon = button.find(".copy-icon").html();
        button.prop("disabled", true);

        function copied() {
            button.find(".copy-icon").text("✓");
            tooltip.stop(true, true).fadeIn(150).delay(1800).fadeOut(200);
            showNotification("Copied to clipboard!");
            setTimeout(function () {
                button.find(".copy-icon").html(originalIcon);
                button.prop("disabled", false);
            }, 2200);
        }

        function copyFailed() {
            button.prop("disabled", false);
            showNotification("Copy was blocked. Please select and copy the text manually.");
        }

        // Fallback also allows copying when index.html is opened as a local file.
        function fallbackCopy() {
            const field = $("<textarea>").val(text).addClass("clipboard-helper").appendTo("body");
            field[0].select();
            try {
                if (document.execCommand("copy")) copied();
                else copyFailed();
            } catch (error) {
                copyFailed();
            }
            field.remove();
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(copied).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    });

    // Task 9. Move data-src into src only when an image enters the viewport.
    function loadImage(image) {
        const source = image.attr("data-src");
        if (!source) return;
        image.one("load", updateScrollProgress);
        image.attr("src", source).removeAttr("data-src");
    }

    function loadLazyImages() {
        $("img[data-src]").each(function () {
            const image = $(this);
            if (isInViewport(image)) loadImage(image);
        });
    }

    // Bootstrap hides inactive slides. Load the next image when its slide appears.
    $("#coffeeCarousel").on("slide.bs.carousel", function (event) {
        if (isInViewport($(this))) {
            $(event.relatedTarget).find("img[data-src]").each(function () {
                loadImage($(this));
            });
        }
    }).on("slid.bs.carousel", loadLazyImages);

    $(window).on("scroll resize load", function () {
        updateScrollProgress();
        animateCounters();
        loadLazyImages();
    });
    updateScrollProgress();
    animateCounters();
    loadLazyImages();
});
