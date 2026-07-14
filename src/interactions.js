// UI Interactions module (scroll spy, mobile nav, cursor glow, card tilt)

export function applyTiltEffect(card) {
    if (!card) return;

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalized offsets (-0.5 to 0.5)
        const nx = (x / rect.width) - 0.5;
        const ny = (y / rect.height) - 0.5;

        // Rotate angle bounds (max 10 degrees)
        const rotateX = -ny * 10;
        const rotateY = nx * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        card.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    });

    card.addEventListener("mouseenter", () => {
        card.style.transition = "none";
    });
}

export function initInteractions() {
    // 1. STICKY HEADER & NAV STATE (SCROLLSPY)
    const header = document.getElementById("mainHeader");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll Spy active link highlight
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run initially

    // 2. MOBILE NAV OVERLAY PANEL
    const menuToggle = document.getElementById("menuToggle");
    const menuOverlay = document.getElementById("menuOverlay");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    function toggleMobileMenu() {
        if (!menuOverlay || !menuToggle) return;
        const isOpen = menuOverlay.classList.contains("open");
        menuToggle.classList.toggle("open", !isOpen);
        menuOverlay.classList.toggle("open", !isOpen);
        document.body.style.overflow = !isOpen ? "hidden" : "";
        menuToggle.setAttribute("aria-expanded", !isOpen);
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMobileMenu);
    }

    // Close mobile menu on clicking any link
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (menuOverlay && menuOverlay.classList.contains("open")) {
                toggleMobileMenu();
            }
        });
    });

    // 3. INTERACTIVE MOUSE BACKGROUNDS (CURSOR GLOW & GRID PERSPECTIVE TILT)
    window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Normalized relative coordinates (-0.5 to 0.5)
        const nx = (x / width) - 0.5;
        const ny = (y / height) - 0.5;

        // Calculations for grid perspective tilt (max 8deg)
        const tiltX = nx * 8; 
        const tiltY = -ny * 8;

        // Calculations for grid sliding offsets (max 15px)
        const offsetX = nx * 15;
        const offsetY = ny * 15;

        // Update CSS custom property states on document
        const doc = document.documentElement;
        doc.style.setProperty("--mouse-x", `${x}px`);
        doc.style.setProperty("--mouse-y", `${y}px`);
        doc.style.setProperty("--grid-tilt-x", `${tiltX}deg`);
        doc.style.setProperty("--grid-tilt-y", `${tiltY}deg`);
        doc.style.setProperty("--grid-offset-x", `${offsetX}px`);
        doc.style.setProperty("--grid-offset-y", `${offsetY}px`);
    });

    // 4. 3D CARD TILT & RADIAL SPOTLIGHT EFFECTS
    const tiltCards = [
        document.getElementById("profileCard"),
        document.getElementById("projectCard1"),
        document.getElementById("projectCard2"),
        document.getElementById("expCard1"),
        document.getElementById("expCard2"),
        document.getElementById("expCard3"),
        document.getElementById("expCard4")
    ];

    // Apply tilt to static container cards
    tiltCards.forEach(applyTiltEffect);

    // 5. SCROLL REVEAL INTERSECTIONS
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Resume alert handler
    const resumeTriggers = document.querySelectorAll(".resume-trigger");
    resumeTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Resume Download: Since this is a live demonstration, the resume asset has been configured as a link to Mustansir's email (mustankap2@gmail.com) and LinkedIn profile to coordinate details. Thank you!");
        });
    });
}
