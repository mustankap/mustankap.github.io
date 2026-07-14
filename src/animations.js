// Motion.dev Animation System module
import { animate, inView, scroll, stagger } from 'motion';

export function initializeSkillsHoverAnimations() {
    document.querySelectorAll(".skill-card-item").forEach(card => {
        card.addEventListener("mouseenter", () => {
            animate(card, { y: -6, scale: 1.03 }, { type: "spring", stiffness: 350, damping: 12 });
        });
        card.addEventListener("mouseleave", () => {
            animate(card, { y: 0, scale: 1.0 }, { type: "spring", stiffness: 350, damping: 18 });
        });
    });
}

export function initAnimations() {
    document.documentElement.classList.add("js-active");

    // 1. Scroll-Linked Progress Bar Indicator
    const progressEl = document.getElementById("scrollProgress");
    if (progressEl) {
        scroll(animate(progressEl, { scaleX: [0, 1] }));
    }

    // Helper: Check if screen is desktop/PC (>= 768px)
    const isDesktop = () => window.innerWidth >= 768;

    // 2. Scroll-Triggered Reveal Entrance Animations (Spring Physics)
    inView(".scroll-reveal", ({ target }) => {
        const isStaggerContainer = 
            target.id === "experience" || 
            target.id === "projects" || 
            target.id === "skills";

        if (isStaggerContainer) {
            animate(
                target,
                { opacity: [0, 1], y: [15, 0] },
                { duration: 0.7, ease: "easeOut" }
            );
            return;
        }

        animate(
            target,
            { opacity: [0, 1], y: [30, 0] },
            {
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1
            }
        );
    });

    // 3. Staggered Entries for Professional Timelines and Cards
    inView(".experience-timeline", ({ target }) => {
        const items = target.querySelectorAll(".exp-timeline-item");
        items.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = "translateY(35px)";
        });
        animate(
            items,
            { opacity: [0, 1], y: [35, 0] },
            {
                delay: stagger(0.12),
                duration: 0.8,
                type: "spring",
                stiffness: 90,
                damping: 14
            }
        );
    });

    // Projects Cards Stagger
    inView(".projects-grid-wrapper", ({ target }) => {
        const cards = target.querySelectorAll(".project-card");
        cards.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = "translateY(35px)";
        });
        animate(
            cards,
            { opacity: [0, 1], y: [35, 0] },
            {
                delay: stagger(0.15),
                duration: 0.8,
                type: "spring",
                stiffness: 90,
                damping: 14
            }
        );
    });

    // Skill Badges Stagger
    inView(".skills-grid-wrapper", ({ target }) => {
        const cards = target.querySelectorAll(".skill-card-item");
        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = "scale(0.85)";
        });
        animate(
            cards,
            { opacity: [0, 1], scale: [0.85, 1] },
            {
                delay: stagger(0.025),
                duration: 0.4,
                ease: "easeOut"
            }
        );
    });

    // 4. Interactive Micro-interactions (Hover / Tap / Press) with spring physics
    // Project Card Hover scale effect
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            if (isDesktop()) {
                animate(card, { scale: 1.025 }, { type: "spring", stiffness: 300, damping: 15 });
            }
        });
        card.addEventListener("mouseleave", () => {
            if (isDesktop()) {
                animate(card, { scale: 1.0 }, { type: "spring", stiffness: 300, damping: 20 });
            }
        });
    });

    // Initialize skill hover animations initially
    initializeSkillsHoverAnimations();

    // Expose helper on window to preserve fallback integration if needed, 
    // but we will also import it directly in skills.js
    window.initializeSkillsHoverAnimations = initializeSkillsHoverAnimations;

    // Floating Coffee CTA bounce and tooltip pop
    const bmcFloat = document.getElementById("bmcFloat");
    if (bmcFloat) {
        bmcFloat.addEventListener("mouseenter", () => {
            animate(bmcFloat, { scale: 1.08 }, { type: "spring", stiffness: 450, damping: 12 });
            animate(".bmc-tooltip", { opacity: 1, y: [5, 0] }, { duration: 0.25 });
        });
        bmcFloat.addEventListener("mouseleave", () => {
            animate(bmcFloat, { scale: 1.0 }, { type: "spring", stiffness: 450, damping: 18 });
            animate(".bmc-tooltip", { opacity: 0, y: [0, 5] }, { duration: 0.2 });
        });
    }

    // General buttons & list icons
    document.querySelectorAll(".btn-primary, .btn-secondary, .social-list a").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            animate(btn, { scale: 1.06 }, { type: "spring", stiffness: 400, damping: 12 });
        });
        btn.addEventListener("mouseleave", () => {
            animate(btn, { scale: 1.0 }, { type: "spring", stiffness: 400, damping: 18 });
        });
        btn.addEventListener("mousedown", () => {
            animate(btn, { scale: 0.94 }, { type: "spring", stiffness: 400, damping: 8 });
        });
        btn.addEventListener("mouseup", () => {
            animate(btn, { scale: 1.06 }, { type: "spring", stiffness: 400, damping: 12 });
        });
    });
}
