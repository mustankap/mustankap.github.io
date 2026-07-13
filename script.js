document.addEventListener("DOMContentLoaded", () => {
    // Stars Background Engine Interfaces
    let startStars = null;
    let stopStars = null;

    // ==========================================================================
    // STICKY HEADER & NAV STATE (SCROLLSPY)
    // ==========================================================================
    const header = document.getElementById("mainHeader");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    function handleScroll() {
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

    // ==========================================================================
    // MOBILE NAV OVERLAY PANEL
    // ==========================================================================
    const menuToggle = document.getElementById("menuToggle");
    const menuOverlay = document.getElementById("menuOverlay");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    function toggleMobileMenu() {
        const isOpen = menuOverlay.classList.contains("open");
        menuToggle.classList.toggle("open", !isOpen);
        menuOverlay.classList.toggle("open", !isOpen);
        document.body.style.overflow = !isOpen ? "hidden" : "";
        menuToggle.setAttribute("aria-expanded", !isOpen);
    }

    menuToggle.addEventListener("click", toggleMobileMenu);

    // Close mobile menu on clicking any link
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (menuOverlay.classList.contains("open")) {
                toggleMobileMenu();
            }
        });
    });

    // ==========================================================================
    // INTERACTIVE MOUSE BACKGROUNDS (CURSOR GLOW & GRID PERSPECTIVE TILT)
    // ==========================================================================
    const cursorGlow = document.getElementById("cursorGlow");
    const gridFlow = document.getElementById("gridFlow");

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

    // ==========================================================================
    // BRAND COLOR SPINNING CYCLER SYSTEM
    // ==========================================================================
    const brands = [
        "violet", "blue", "cyan", "teal", "green", 
        "lime", "amber", "orange", "pink", "fuchsia", "indigo"
    ];
    
    const brandColorsHex = {
        violet: { accent: "262 83% 65%", rgb: "139, 92, 246", primary: "#8b5cf6", secondary: "#a78bfa" },
        blue: { accent: "217 91% 60%", rgb: "59, 130, 246", primary: "#3b82f6", secondary: "#60a5fa" },
        cyan: { accent: "199 89% 48%", rgb: "6, 182, 212", primary: "#06b6d4", secondary: "#22d3ee" },
        teal: { accent: "173 80% 40%", rgb: "20, 184, 166", primary: "#14b8a6", secondary: "#2dd4bf" },
        green: { accent: "160 84% 39%", rgb: "16, 185, 129", primary: "#10b981", secondary: "#34d399" },
        lime: { accent: "84 81% 44%", rgb: "132, 204, 22", primary: "#84cc16", secondary: "#a3e635" },
        amber: { accent: "38 92% 50%", rgb: "245, 158, 11", primary: "#f59e0b", secondary: "#fbbf24" },
        orange: { accent: "24 94% 52%", rgb: "249, 115, 22", primary: "#f97316", secondary: "#fb923c" },
        pink: { accent: "347 77% 50%", rgb: "244, 63, 94", primary: "#f43f5e", secondary: "#fb7185" },
        fuchsia: { accent: "292 84% 61%", rgb: "217, 70, 239", primary: "#d946ef", secondary: "#f0abfc" },
        indigo: { accent: "239 84% 67%", rgb: "99, 102, 241", primary: "#6366f1", secondary: "#818cf8" }
    };

    let activeColors = {
        primary: "#8b5cf6",
        secondary: "#a78bfa"
    };

    let currentBrand = localStorage.getItem("portfolio-brand") || "violet";
    if (!brandColorsHex[currentBrand]) currentBrand = "violet";

    function applyBrand(brandName) {
        const brand = brandColorsHex[brandName];
        const doc = document.documentElement;
        doc.style.setProperty("--primary", brand.accent);
        doc.style.setProperty("--accent", brand.accent);
        doc.style.setProperty("--primary-rgb", brand.rgb);
        
        // Update variables for canvas animations
        activeColors.primary = brand.primary;
        activeColors.secondary = brand.secondary;

        localStorage.setItem("portfolio-brand", brandName);
    }

    // Apply saved brand on load
    applyBrand(currentBrand);

    const brandCycler = document.getElementById("brandCycler");
    brandCycler.addEventListener("click", () => {
        let idx = brands.indexOf(currentBrand);
        idx = (idx + 1) % brands.length;
        currentBrand = brands[idx];
        applyBrand(currentBrand);
    });

    // ==========================================================================
    // THEME ENGINE (DARK / LIGHT TOGGLER)
    // ==========================================================================
    const themeToggler = document.getElementById("themeToggler");
    const sunIcon = themeToggler.querySelector(".theme-sun-icon");
    const moonIcon = themeToggler.querySelector(".theme-moon-icon");

    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add("dark");
            sunIcon.classList.add("hidden");
            moonIcon.classList.remove("hidden");
        } else {
            document.documentElement.classList.remove("dark");
            sunIcon.classList.remove("hidden");
            moonIcon.classList.add("hidden");
        }
        if (startStars) startStars();
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    }

    // Initialize theme based on preference or system settings
    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
    applyTheme(initialDark);

    themeToggler.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(!isDark);
    });

    // ==========================================================================
    // 3D CARD TILT & RADIAL SPOTLIGHT EFFECTS
    // ==========================================================================
    const tiltCards = [
        document.getElementById("profileCard"),
        document.getElementById("projectCard1"),
        document.getElementById("projectCard2"),
        document.getElementById("expCard1"),
        document.getElementById("expCard2"),
        document.getElementById("expCard3"),
        document.getElementById("expCard4")
    ];

    function applyTiltEffect(card) {
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

    // Apply tilt to static container cards
    tiltCards.forEach(applyTiltEffect);

    // ==========================================================================
    // SCRAMBLE TITLE ANIMATION ENGINE
    // ==========================================================================
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    class ScrambleTitleSolver {
        constructor(element) {
            this.el = element;
            this.chars = "!<>-_\\/[]{}—=+*^?#________";
            this.update = this.update.bind(this);
        }

        solve(targetText, duration = 800) {
            this.targetText = targetText;
            const length = targetText.length;
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const char = targetText[i];
                if (char === " ") {
                    this.queue.push({ from: " ", to: " ", start: 0, end: 1 });
                    continue;
                }
                const start = Math.floor(Math.random() * 20);
                const end = start + Math.floor(Math.random() * 25);
                this.queue.push({ from: "", to: char, start, end, currentChar: "" });
            }

            this.cancel();
            this.frame = 0;
            
            return new Promise((resolve) => {
                this.resolve = resolve;
                this.update();
            });
        }

        cancel() {
            if (this.frameId) {
                cancelAnimationFrame(this.frameId);
                this.frameId = null;
            }
        }

        update() {
            let output = "";
            let complete = 0;

            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, currentChar } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += escapeHtml(to);
                } else if (this.frame >= start) {
                    if (!currentChar || Math.random() < 0.28) {
                        currentChar = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].currentChar = currentChar;
                    }
                    output += `<span class="scramble-char">${escapeHtml(currentChar)}</span>`;
                } else {
                    output += escapeHtml(from);
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameId = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Intersection Observer to trigger Title Scrambling on enter
    const titleElements = document.querySelectorAll("[data-scramble]");
    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.getAttribute("data-scramble");
                
                if (el.scrambleSolver) {
                    el.scrambleSolver.cancel();
                }
                
                const solver = new ScrambleTitleSolver(el);
                el.scrambleSolver = solver;
                
                solver.solve(text).then(() => {
                    if (el.scrambleSolver === solver) {
                        el.scrambleSolver = null;
                    }
                });
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    titleElements.forEach(el => titleObserver.observe(el));

    // ==========================================================================
    // DYNAMIC SKILLS & FILTER GENERATION
    // ==========================================================================
    const skillsFiltersContainer = document.getElementById("skillsFilters");
    const skillsGridContainer = document.getElementById("skillsGrid");

    if (skillsFiltersContainer && skillsGridContainer) {
        fetch("skills.json?t=" + new Date().getTime())
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                // Render filters
                skillsFiltersContainer.innerHTML = data.filters.map((filter, index) => {
                    const activeClass = index === 0 ? "active" : "";
                    return `<button class="filter-btn ${activeClass}" data-filter="${filter.id}">${filter.label}</button>`;
                }).join("");

                // Render skills
                skillsGridContainer.innerHTML = data.skills.map(skill => {
                    return `
                    <div class="skill-card-item glass-card" data-category="${skill.category}" title="${skill.title}">
                        <div class="skill-card-icon">
                            ${skill.icon}
                        </div>
                        <span class="skill-card-name">${skill.name}</span>
                    </div>
                    `;
                }).join("");

                // Initialize filter logic and 3D tilt effects
                initializeSkillsFilter();
            })
            .catch(error => {
                console.error("Error loading skills:", error);
            });
    }

    function initializeSkillsFilter() {
        const skillCards = document.querySelectorAll(".skill-card-item");
        const filterButtons = document.querySelectorAll("#skillsFilters .filter-btn");

        // Apply 3D tilt to skill cards
        skillCards.forEach(applyTiltEffect);

        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                // Toggle active state in controls
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                skillCards.forEach(card => {
                    const category = card.getAttribute("data-category");
                    
                    if (filterValue === "all" || category === filterValue) {
                        card.classList.remove("hidden");
                        // Triggers scale-in transitions
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.85)";
                        // Wait for fade transition, then hide structure
                        setTimeout(() => {
                            card.classList.add("hidden");
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // SCROLL REVEAL INTERSECTIONS
    // ==========================================================================
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

    // ==========================================================================
    // CONTACT FORM VALIDATION & FEEDBACK CONTROL
    // ==========================================================================
    const contactForm = document.getElementById("contactForm");
    const btnSubmit = document.getElementById("btnSubmit");
    const spinner = btnSubmit.querySelector(".spinner-icon");
    const btnText = btnSubmit.querySelector("span");
    const formFeedback = document.getElementById("formFeedback");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("form-name").value.trim();
        const email = document.getElementById("form-email").value.trim();
        const subject = document.getElementById("form-subject").value.trim();
        const message = document.getElementById("form-message").value.trim();

        if (!name || !email || !subject || !message) {
            showFeedback("Please fill out all fields before submitting.", "error");
            return;
        }

        btnSubmit.disabled = true;
        spinner.classList.remove("hide");
        btnText.textContent = "Sending...";
        formFeedback.classList.add("hide");

        fetch("https://formsubmit.co/ajax/1168346a632d5d218dccefc869c09110", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                _subject: subject,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            btnSubmit.disabled = false;
            spinner.classList.add("hide");
            btnText.textContent = "Send Message";
            if (data.success === "true" || data.success === true) {
                showFeedback(data.message || "Thank you! Your message has been sent successfully. Mustansir will get back to you soon.", "success");
                contactForm.reset();
            } else {
                showFeedback(data.message || "Something went wrong. Please try again.", "error");
            }
        })
        .catch(error => {
            btnSubmit.disabled = false;
            spinner.classList.add("hide");
            btnText.textContent = "Send Message";
            showFeedback("Failed to send message. Please check your connection.", "error");
        });
    });

    function showFeedback(text, type) {
        formFeedback.textContent = text;
        formFeedback.className = "form-feedback";
        formFeedback.classList.add(type);
        formFeedback.classList.remove("hide");
    }

    // Trigger alert for resume link clicks
    const resumeTriggers = document.querySelectorAll(".resume-trigger");
    resumeTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Resume Download: Since this is a live demonstration, the resume asset has been configured as a link to Mustansir's email (mustankap2@gmail.com) and LinkedIn profile to coordinate details. Thank you!");
        });
    });

    // ==========================================================================
    // DUST PARTICLE TEXT ANIMATION (CANVAS ACCENT ACCORDED BRIDGE)
    // ==========================================================================
    const canvas = document.getElementById("particleCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        let width = 0;
        let height = 0;
        let particles = [];
        let mouse = { x: null, y: null, radius: 80 };
        let animationFrameId = null;

        let isCanvasVisible = true;

        // Offscreen canvas for mapping pixels
        const offscreenCanvas = document.createElement("canvas");
        const offCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

        // IntersectionObserver to pause rendering when canvas is off-screen
        const canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isCanvasVisible = entry.isIntersecting;
                if (isCanvasVisible) {
                    if (!animationFrameId) {
                        animate();
                    }
                } else {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        canvasObserver.observe(canvas);

        function initParticles() {
            // Cancel active frame during reinitialization
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            const rect = canvas.parentNode.getBoundingClientRect();
            width = Math.round(rect.width);
            height = Math.round(rect.height);
            
            canvas.width = width;
            canvas.height = height;
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;

            offCtx.clearRect(0, 0, width, height);

            const isMobile = window.innerWidth < 768;
            let fontSize = isMobile ? 42 : 72;
            
            // Set font details (Space Grotesk matches our main headings)
            offCtx.font = `700 ${fontSize}px Arial, sans-serif`;
            offCtx.fillStyle = "#ffffff";
            offCtx.textBaseline = "middle";

            // Centered alignment on mobile, left alignment on desktop
            offCtx.textAlign = isMobile ? "center" : "left";
            
            // Scale font size down dynamically if it exceeds canvas width (with 20px padding)
            const textToDraw = "Mustansir Kapasi";
            while (fontSize > 16 && offCtx.measureText(textToDraw).width > width - 20) {
                fontSize -= 2;
                offCtx.font = `700 ${fontSize}px Arial, sans-serif`;
            }

            const textX = isMobile ? width / 2 : 0;
            const textY = height / 2;
            offCtx.fillText(textToDraw, textX, textY);

            // Scan pixels in the drawn name
            const imgData = offCtx.getImageData(0, 0, width, height);
            const data = imgData.data;
            particles = [];

            // Step size matches density; grid sampling
            const step = isMobile ? 4 : 5; // Optimized density
            mouse.radius = isMobile ? 45 : 85;

            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    const index = (y * width + x) * 4;
                    const alpha = data[index + 3];
                    
                    if (alpha > 128) {
                        particles.push({
                            destX: x,
                            destY: y,
                            x: Math.random() * width,
                            y: Math.random() * height,
                            size: Math.random() * 1.5 + 1.1,
                            vx: 0,
                            vy: 0,
                            ease: 0.08 + Math.random() * 0.08, // 2x faster ease-in speed
                            friction: 0.78 + Math.random() * 0.06 // Slightly lower friction to settle faster
                        });
                    }
                }
            }

            // Start animation loop if visible
            if (isCanvasVisible) {
                animate();
            }
        }

        function animate() {
            if (!isCanvasVisible) {
                animationFrameId = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Update particle positions
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse interaction physics
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && mouse.x !== null) {
                    const force = (mouse.radius - dist) / mouse.radius; // Normalized 0-1 force strength
                    const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
                    
                    // Push particles away from cursor
                    const pushX = Math.cos(angle) * force * 5.5;
                    const pushY = Math.sin(angle) * force * 5.5;

                    p.vx += pushX;
                    p.vy += pushY;
                }

                // Elastic ease back to destination coordinate
                const destDx = p.destX - p.x;
                const destDy = p.destY - p.y;

                p.vx += destDx * p.ease;
                p.vy += destDy * p.ease;

                // Apply velocity friction dampener
                p.vx *= p.friction;
                p.vy *= p.friction;

                p.x += p.vx;
                p.y += p.vy;
            }

            // Draw all particles in one batch using the darker primary theme color
            ctx.fillStyle = activeColors.primary;
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.moveTo(p.x + p.size, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            ctx.fill();

            animationFrameId = requestAnimationFrame(animate);
        }

        // Mouse listeners
        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Mobile touch listeners
        canvas.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.touches[0].clientX - rect.left;
                mouse.y = e.touches[0].clientY - rect.top;
            }
        }, { passive: true });

        canvas.addEventListener("touchend", () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize debouncer
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                initParticles();
            }, 250);
        });

        // Font Loading Guard: Ensures Nova Square loads before computing pixel map coordinates
        if (document.fonts) {
            document.fonts.ready.then(() => {
                setTimeout(initParticles, 100);
            });
        } else {
            window.addEventListener("load", initParticles);
        }
    }

    // ==========================================================================
    // 3D TWINKLING STARS & CONSTELLATIONS BACKGROUND ENGINE (DARK/LIGHT INTERACTIVE ACCENT)
    // ==========================================================================
    const starsCanvas = document.getElementById("starsCanvas");
    if (starsCanvas) {
        const sCtx = starsCanvas.getContext("2d");
        let sWidth = 0;
        let sHeight = 0;
        let stars = [];
        const numStars = 350;
        const maxDepth = 1000;
        const focalLength = 320;
        let starsAnimationFrameId = null;

        // Base rotation speeds (slow yaw and pitch)
        const baseRotY = 0.00015;
        const baseRotX = 0.00007;

        let cumulativeAngleY = 0;
        let cumulativeAngleX = 0;

        // Interactive scroll speed boost variables
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;

        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;
            const delta = Math.abs(currentScrollY - lastScrollY);
            scrollVelocity += delta * 0.12; // Scroll impact scale
            lastScrollY = currentScrollY;
        }, { passive: true });

        // Mouse & Touch Tracking
        let mouseX = null;
        let mouseY = null;
        let prevMouseX = null;
        let prevMouseY = null;
        let mouseSpeed = 0;
        let pointerEnergy = 0;
        let lastTime = performance.now();

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener("mouseleave", () => {
            mouseX = null;
            mouseY = null;
        });

        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener("touchend", () => {
            mouseX = null;
            mouseY = null;
        });

        function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            const num = parseInt(hex, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }

        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        function getStarColor(isLight, energy) {
            const baseHex = isLight ? "#0f172a" : "#f8fafc";
            const accentHex = activeColors.primary;
            
            const baseRgb = hexToRgb(baseHex);
            const accentRgb = hexToRgb(accentHex);
            
            const r = Math.round(lerp(baseRgb.r, accentRgb.r, energy * 0.9));
            const g = Math.round(lerp(baseRgb.g, accentRgb.g, energy * 0.9));
            const b = Math.round(lerp(baseRgb.b, accentRgb.b, energy * 0.9));
            
            return { r, g, b };
        }

        function initStarsCanvas() {
            sWidth = window.innerWidth;
            sHeight = window.innerHeight;
            starsCanvas.width = sWidth;
            starsCanvas.height = sHeight;
            
            // Re-generate stars to fit new screen bounds
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    baseX: (Math.random() - 0.5) * sWidth * 1.5,
                    baseY: (Math.random() - 0.5) * sHeight * 1.5,
                    baseZ: Math.random() * maxDepth,
                    dispX: 0,
                    dispY: 0,
                    dispZ: 0,
                    size: Math.random() * 1.6 + 0.8,
                    twinkleSpeed: 0.01 + Math.random() * 0.02,
                    phase: Math.random() * Math.PI * 2,
                    connections: []
                });
            }

            // Establish constellation links: connect each star to its nearest 1 or 2 neighbors
            for (let i = 0; i < numStars; i++) {
                const starA = stars[i];
                const distances = [];
                for (let j = 0; j < numStars; j++) {
                    if (i === j) continue;
                    const starB = stars[j];
                    const dx = starA.baseX - starB.baseX;
                    const dy = starA.baseY - starB.baseY;
                    const dz = starA.baseZ - starB.baseZ;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    distances.push({ index: j, dist });
                }

                distances.sort((a, b) => a.dist - b.dist);
                
                const maxConnections = 2;
                const threshold = 220;
                let count = 0;
                for (let k = 0; k < distances.length && count < maxConnections; k++) {
                    if (distances[k].dist < threshold) {
                        if (distances[k].index > i) {
                            starA.connections.push(distances[k].index);
                        }
                        count++;
                    }
                }
            }
        }

        function updateAndRenderStars() {
            const currentTime = performance.now();
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Compute mouse speed and pointer energy
            if (mouseX !== null && prevMouseX !== null) {
                const pointerX = (mouseX / sWidth - 0.5) * 2.2;
                const pointerY = (mouseY / sHeight - 0.5) * 2.2;

                const prevPointerX = (prevMouseX / sWidth - 0.5) * 2.2;
                const prevPointerY = (prevMouseY / sHeight - 0.5) * 2.2;

                const dx = pointerX - prevPointerX;
                const dy = pointerY - prevPointerY;
                const instSpeed = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.016);
                
                mouseSpeed += (instSpeed - mouseSpeed) * 0.08;
                pointerEnergy = Math.min(mouseSpeed * 0.35, 1);
            } else if (mouseX === null) {
                pointerEnergy = 0;
                mouseSpeed = 0;
                prevMouseX = null;
                prevMouseY = null;
            }

            prevMouseX = mouseX;
            prevMouseY = mouseY;

            // Decay scroll speed boost back to zero
            scrollVelocity *= 0.95;

            // Combine base rotation speed with scroll velocity boost
            const rotYSpeed = baseRotY + scrollVelocity * 0.003;
            const rotXSpeed = baseRotX + scrollVelocity * 0.0012;

            cumulativeAngleY -= rotYSpeed;
            cumulativeAngleX -= rotXSpeed;

            const cosY = Math.cos(cumulativeAngleY);
            const sinY = Math.sin(cumulativeAngleY);
            const cosX = Math.cos(cumulativeAngleX);
            const sinX = Math.sin(cumulativeAngleX);

            // Clear canvas
            sCtx.clearRect(0, 0, sWidth, sHeight);

            const time = currentTime / 1000;
            const isLight = !document.documentElement.classList.contains("dark");

            // Update star coordinates and calculate perspective projections
            for (let i = 0; i < stars.length; i++) {
                const p = stars[i];

                // Rotate around cumulative angles in 3D
                let zCentered = p.baseZ - maxDepth / 2;
                let x1 = p.baseX * cosY - zCentered * sinY;
                let z1 = p.baseX * sinY + zCentered * cosY;
                let y2 = p.baseY * cosX - z1 * sinX;
                let z2 = p.baseY * sinX + z1 * cosX;

                let rotX = x1;
                let rotY = y2;
                let rotZ = z2 + maxDepth / 2;

                // Wrap stars in depth
                if (rotZ <= 10) {
                    p.baseZ += maxDepth;
                    rotZ += maxDepth;
                } else if (rotZ > maxDepth) {
                    p.baseZ -= maxDepth;
                    rotZ -= maxDepth;
                }

                // Advance twinkle phase
                p.phase += p.twinkleSpeed;

                // Mouse interaction physics
                let swirlX = 0, swirlY = 0;
                let pullX = 0, pullY = 0;
                let lift = 0;
                let localInfluence = 0;

                if (mouseX !== null) {
                    const starNormX = rotX / sWidth;
                    const starNormY = rotY / sHeight;
                    const pointerX = (mouseX / sWidth - 0.5) * 1.5;
                    const pointerY = (mouseY / sHeight - 0.5) * 1.5;

                    const dx = starNormX - pointerX;
                    const dy = starNormY - pointerY;
                    const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;

                    // Falloff for swirl & shift (radius = 1.55)
                    const falloff = Math.max(0, 1.55 - dist);
                    const swirlStrength = falloff * (0.04 + pointerEnergy * 0.12);
                    swirlX = (-dy / dist) * swirlStrength * sWidth;
                    swirlY = (dx / dist) * swirlStrength * sHeight;

                    // Local pull (radius = 0.45)
                    const localRadius = 0.45;
                    const localFalloff = Math.max(0, 1 - dist / localRadius);
                    localInfluence = Math.pow(localFalloff, 2.5);
                    const pulse = 0.35 + 0.65 * Math.sin(time * 1.3 + i * 0.4);
                    const pullMag = 0.15 * pulse;
                    pullX = dx * -pullMag * localInfluence * sWidth;
                    pullY = dy * -pullMag * localInfluence * sHeight;

                    // Lift (moves star closer to camera on Z axis)
                    lift = localInfluence * 0.25 * pulse * maxDepth;
                    const zFalloffLift = falloff * (0.08 + pointerEnergy * 0.08) * maxDepth;
                    lift += zFalloffLift;
                }

                // Target displacements
                const targetDispX = swirlX + pullX;
                const targetDispY = swirlY + pullY;
                const targetDispZ = -lift;

                // Wave twinkle effect
                const wave = Math.sin(time * (0.6 + p.twinkleSpeed * 50) + i * 0.5) * 0.035 * maxDepth;
                const finalTargetDispZ = targetDispZ + wave;

                // Easing (Euler integration)
                const lerpBase = 0.08 + pointerEnergy * 0.05;
                const influence = lerpBase + localInfluence * 0.3;

                p.dispX += (targetDispX - p.dispX) * influence;
                p.dispY += (targetDispY - p.dispY) * influence;
                p.dispZ += (finalTargetDispZ - p.dispZ) * (0.06 + pointerEnergy * 0.04);

                // Final coordinates
                const finalX = rotX + p.dispX;
                const finalY = rotY + p.dispY;
                const finalZ = rotZ + p.dispZ;

                const clampedZ = Math.max(10, finalZ);

                // 3D Perspective Projection
                const k = focalLength / clampedZ;
                p.projX = finalX * k + sWidth / 2;
                p.projY = finalY * k + sHeight / 2;
                p.currentZ = clampedZ;
            }

            // Draw Constellation Connecting Lines (Single path for performance)
            sCtx.beginPath();
            const lineColor = isLight ? "rgba(15, 23, 42, 0.05)" : "rgba(248, 250, 252, 0.05)";
            sCtx.strokeStyle = lineColor;
            sCtx.lineWidth = 0.55;

            for (let i = 0; i < stars.length; i++) {
                const starA = stars[i];
                if (starA.projX < 0 || starA.projX > sWidth || starA.projY < 0 || starA.projY > sHeight) continue;

                for (let j = 0; j < starA.connections.length; j++) {
                    const starB = stars[starA.connections[j]];
                    if (starB.projX < 0 || starB.projX > sWidth || starB.projY < 0 || starB.projY > sHeight) continue;

                    sCtx.moveTo(starA.projX, starA.projY);
                    sCtx.lineTo(starB.projX, starB.projY);
                }
            }
            sCtx.stroke();

            // Draw Twinkling Star Spots
            for (let i = 0; i < stars.length; i++) {
                const p = stars[i];
                if (p.projX < 0 || p.projX > sWidth || p.projY < 0 || p.projY > sHeight) continue;

                // Twinkle size & opacity modulation
                const twinkle = 0.35 + 0.65 * Math.sin(p.phase);
                const depthOpacity = Math.max(0, 1 - p.currentZ / maxDepth);
                const opacity = twinkle * depthOpacity * 0.95;
                
                const sizeMultiplier = 1 + pointerEnergy * 2.2;
                const size = p.size * (focalLength / p.currentZ) * 0.85 * sizeMultiplier;

                const color = getStarColor(isLight, pointerEnergy);

                sCtx.beginPath();
                sCtx.arc(p.projX, p.projY, Math.max(0.6, size), 0, Math.PI * 2);
                sCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                sCtx.fill();
            }

            starsAnimationFrameId = requestAnimationFrame(updateAndRenderStars);
        }

        startStars = function() {
            if (!starsAnimationFrameId) {
                initStarsCanvas();
                updateAndRenderStars();
            }
        };

        stopStars = function() {
            if (starsAnimationFrameId) {
                cancelAnimationFrame(starsAnimationFrameId);
                starsAnimationFrameId = null;
            }
        };

        // Initialize background stars
        initStarsCanvas();

        // Start stars initially
        if (startStars) {
            startStars();
        }

        // Resize handler
        let sResizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(sResizeTimer);
            sResizeTimer = setTimeout(() => {
                initStarsCanvas();
            }, 250);
        });
    }
});
