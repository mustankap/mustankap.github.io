// Image Lightbox / Modal Carousel interaction module
export function initLightbox() {
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImage");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");

    if (!lightbox || !lightboxImg) return;

    let currentImages = [];
    let currentIndex = 0;

    // Open Lightbox
    function openLightbox(imagesList, index) {
        currentImages = imagesList;
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent scrolling background
    }

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        
        // Restore overflow scroll if mobile menu overlay is not open
        const menuOverlay = document.getElementById("menuOverlay");
        if (!menuOverlay || !menuOverlay.classList.contains("open")) {
            document.body.style.overflow = "";
        }
    }

    // Update Image src/alt & Arrow visibility
    function updateLightboxContent() {
        if (currentImages.length === 0) return;
        const currentImgData = currentImages[currentIndex];
        lightboxImg.src = currentImgData.src;
        lightboxImg.alt = currentImgData.alt;

        // Show navigation arrows if there is more than 1 image
        if (currentImages.length > 1) {
            prevBtn.classList.remove("hidden");
            nextBtn.classList.remove("hidden");
        } else {
            prevBtn.classList.add("hidden");
            nextBtn.classList.add("hidden");
        }
    }

    // Carousel Navigation
    function showPrev() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxContent();
    }

    // Carousel Navigation
    function showNext() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxContent();
    }

    // Attach listeners directly to each image for robust mobile touch/click support
    const projectImages = document.querySelectorAll(".project-card-image img");
    projectImages.forEach(img => {
        img.addEventListener("click", (e) => {
            const clickedImg = e.currentTarget;
            const container = clickedImg.closest(".project-card-image");
            if (!container) return;

            const imgs = Array.from(container.querySelectorAll("img"));
            const imagesList = imgs.map(i => ({
                src: i.getAttribute("src"),
                alt: i.getAttribute("alt") || "Project Image"
            }));

            const clickedIndex = imgs.indexOf(clickedImg);
            openLightbox(imagesList, clickedIndex >= 0 ? clickedIndex : 0);
        });
    });

    // Close Button Event
    closeBtn.addEventListener("click", closeLightbox);

    // Backdrop click close (clicking outside the image container)
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
            closeLightbox();
        }
    });

    // Carousel Arrow Click Events
    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showPrev();
    });

    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showNext();
    });

    // Keyboard accessibility controls
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            showPrev();
        } else if (e.key === "ArrowRight") {
            showNext();
        }
    });
}
