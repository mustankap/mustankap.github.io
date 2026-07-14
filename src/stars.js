// 3D Twinkling Stars Background Canvas Animation module
import { activeColors, onThemeChange } from './brandColors.js';

export function initStars() {
    const starsCanvas = document.getElementById("starsCanvas");
    if (!starsCanvas) return;

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

    function startStars() {
        if (!starsAnimationFrameId) {
            initStarsCanvas();
            updateAndRenderStars();
        }
    }

    function stopStars() {
        if (starsAnimationFrameId) {
            cancelAnimationFrame(starsAnimationFrameId);
            starsAnimationFrameId = null;
        }
    }

    // Initialize background stars
    initStarsCanvas();
    startStars();

    // Resize handler
    let sResizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(sResizeTimer);
        sResizeTimer = setTimeout(() => {
            initStarsCanvas();
        }, 250);
    });

    // Handle theme toggle restart
    onThemeChange(() => {
        startStars();
    });
}
