// Scramble Title Animation Engine module

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export class ScrambleTitleSolver {
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

export function initScrambleTitleAnimations() {
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
}
