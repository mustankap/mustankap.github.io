// Brand color cycler and theme engine module

export const brands = [
    "violet", "blue", "cyan", "teal", "green", 
    "lime", "amber", "orange", "pink", "fuchsia", "indigo"
];

export const brandColorsHex = {
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

export let activeColors = {
    primary: "#8b5cf6",
    secondary: "#a78bfa"
};

let themeChangeCallbacks = [];

export function onThemeChange(callback) {
    themeChangeCallbacks.push(callback);
}

export function applyBrand(brandName) {
    const brand = brandColorsHex[brandName];
    if (!brand) return;
    const doc = document.documentElement;
    doc.style.setProperty("--primary", brand.accent);
    doc.style.setProperty("--accent", brand.accent);
    doc.style.setProperty("--primary-rgb", brand.rgb);
    
    activeColors.primary = brand.primary;
    activeColors.secondary = brand.secondary;

    localStorage.setItem("portfolio-brand", brandName);
}

export function initBrandAndThemeEngine() {
    let currentBrand = localStorage.getItem("portfolio-brand") || "violet";
    if (!brandColorsHex[currentBrand]) currentBrand = "violet";

    // Apply saved brand on load
    applyBrand(currentBrand);

    const brandCycler = document.getElementById("brandCycler");
    if (brandCycler) {
        brandCycler.addEventListener("click", () => {
            let idx = brands.indexOf(currentBrand);
            idx = (idx + 1) % brands.length;
            currentBrand = brands[idx];
            applyBrand(currentBrand);
        });
    }

    const themeToggler = document.getElementById("themeToggler");
    if (themeToggler) {
        const sunIcon = themeToggler.querySelector(".theme-sun-icon");
        const moonIcon = themeToggler.querySelector(".theme-moon-icon");

        const applyTheme = (isDark) => {
            if (isDark) {
                document.documentElement.classList.add("dark");
                if (sunIcon) sunIcon.classList.add("hidden");
                if (moonIcon) moonIcon.classList.remove("hidden");
            } else {
                document.documentElement.classList.remove("dark");
                if (sunIcon) sunIcon.classList.remove("hidden");
                if (moonIcon) moonIcon.classList.add("hidden");
            }
            
            // Notify subscribers (e.g. stars canvas to restart)
            themeChangeCallbacks.forEach(cb => cb(isDark));
            
            localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
        };

        const savedTheme = localStorage.getItem("portfolio-theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
        applyTheme(initialDark);

        themeToggler.addEventListener("click", () => {
            const isDark = document.documentElement.classList.contains("dark");
            applyTheme(!isDark);
        });
    }
}
