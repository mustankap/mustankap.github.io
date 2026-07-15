// Main application entry point
import '../style.css';
import { initBrandAndThemeEngine } from './brandColors.js';
import { initInteractions } from './interactions.js';
import { initLightbox } from './lightbox.js';
import { initScrambleTitleAnimations } from './scramble.js';
import { initSkills } from './skills.js';
import { initContactForm } from './form.js';
import { initParticles } from './particles.js';
import { initStars } from './stars.js';
import { initAnimations } from './animations.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme and color management
    initBrandAndThemeEngine();

    // 2. UI Interactions (scrollspy, mobile menu, cursor glow, tilt)
    initInteractions();

    // 2b. Lightbox Image Carousel
    initLightbox();

    // 3. Text scramble headings
    initScrambleTitleAnimations();

    // 4. Skills card rendering & filters
    initSkills();

    // 5. Contact form validator
    initContactForm();

    // 6. Interactive canvas particle name
    initParticles();

    // 7. Twinkling 3D stars background
    initStars();

    // 8. Motion.dev animations and micro-interactions
    initAnimations();
});
