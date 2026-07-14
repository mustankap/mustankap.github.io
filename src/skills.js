// Skills rendering and filter system module
import skillsData from '../skills.json';
import { applyTiltEffect } from './interactions.js';
import { initializeSkillsHoverAnimations } from './animations.js';

export function initSkills() {
    const skillsFiltersContainer = document.getElementById("skillsFilters");
    const skillsGridContainer = document.getElementById("skillsGrid");

    if (!skillsFiltersContainer || !skillsGridContainer) return;

    function renderSkills(data) {
        // Render filters
        skillsFiltersContainer.innerHTML = data.filters.map((filter, index) => {
            const activeClass = index === 0 ? "active" : "";
            return `<button class="filter-btn ${activeClass}" data-filter="${filter.id}">${filter.label}</button>`;
        }).join("");

        // Render skills
        skillsGridContainer.innerHTML = data.skills.map(skill => {
            const isSvgString = skill.icon.trim().startsWith("<svg");
            const invertClass = skill.invertInDark ? "invert-dark" : "";
            const iconContent = isSvgString 
                ? skill.icon 
                : `<img src="${skill.icon}" alt="${skill.name}" class="tech-logo ${invertClass}" />`;
            return `
            <div class="skill-card-item glass-card" data-category="${skill.category}" title="${skill.title}">
                <div class="skill-card-icon">
                    ${iconContent}
                </div>
                <span class="skill-card-name">${skill.name}</span>
            </div>
            `;
        }).join("");

        // Initialize filter logic and 3D tilt effects
        initializeSkillsFilter();
    }

    function initializeSkillsFilter() {
        const skillCards = document.querySelectorAll(".skill-card-item");
        const filterButtons = document.querySelectorAll("#skillsFilters .filter-btn");

        // Apply 3D tilt to skill cards
        skillCards.forEach(applyTiltEffect);

        // Initialize Motion hover animations
        initializeSkillsHoverAnimations();

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

    // Render directly using imported json data
    renderSkills(skillsData);
}
