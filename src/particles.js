// Dust Particle Text Canvas Animation module
import { activeColors } from './brandColors.js';

export function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;

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

    function initParticlesData() {
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
        let fontSize = isMobile ? 55 : 100; // Increased size of each letter
        
        // Set font details (Space Grotesk matches our main headings)
        offCtx.font = `700 ${fontSize}px "Comic Sans MS", cursive, sans-serif`;
        offCtx.fillStyle = "#ffffff";
        offCtx.textBaseline = "middle";

        // Centered alignment on mobile, left alignment on desktop
        offCtx.textAlign = isMobile ? "center" : "left";
        
        // Scale font size down dynamically if it exceeds canvas width (with 20px padding)
        const textToDraw = "Mustansir Kapasi";
        while (fontSize > 16 && offCtx.measureText(textToDraw).width > width - 20) {
            fontSize -= 2;
            offCtx.font = `700 ${fontSize}px "Comic Sans MS", cursive, sans-serif`;
        }

        const textX = isMobile ? width / 2 : 0;
        const textY = height / 2;
        offCtx.fillText(textToDraw, textX, textY);

        // Scan pixels in the drawn name
        const imgData = offCtx.getImageData(0, 0, width, height);
        const data = imgData.data;
        particles = [];

        // Step size matches density; grid sampling
        const step = isMobile ? 2 : 3; // Finer grid sampling = higher density and count of balls
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
                        size: Math.random() * 1.8 + 1.2, // Slightly larger balls for a fuller lettering look
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
            initParticlesData();
        }, 250);
    });

    // Font Loading Guard: Ensures font loads before computing pixel map coordinates
    if (document.fonts) {
        document.fonts.ready.then(() => {
            setTimeout(initParticlesData, 100);
        });
    } else {
        window.addEventListener("load", initParticlesData);
    }
}
