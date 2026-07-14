// Contact Form Submission Handler module

export function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    const btnSubmit = document.getElementById("btnSubmit");
    const spinner = btnSubmit ? btnSubmit.querySelector(".spinner-icon") : null;
    const btnText = btnSubmit ? btnSubmit.querySelector("span") : null;
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

        if (btnSubmit) btnSubmit.disabled = true;
        if (spinner) spinner.classList.remove("hide");
        if (btnText) btnText.textContent = "Sending...";
        if (formFeedback) formFeedback.classList.add("hide");

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
            if (btnSubmit) btnSubmit.disabled = false;
            if (spinner) spinner.classList.add("hide");
            if (btnText) btnText.textContent = "Send Message";
            if (data.success === "true" || data.success === true) {
                showFeedback(data.message || "Thank you! Your message has been sent successfully. Mustansir will get back to you soon.", "success");
                contactForm.reset();
            } else {
                showFeedback(data.message || "Something went wrong. Please try again.", "error");
            }
        })
        .catch(error => {
            if (btnSubmit) btnSubmit.disabled = false;
            if (spinner) spinner.classList.add("hide");
            if (btnText) btnText.textContent = "Send Message";
            showFeedback("Failed to send message. Please check your connection.", "error");
        });
    });

    function showFeedback(text, type) {
        if (!formFeedback) return;
        formFeedback.textContent = text;
        formFeedback.className = "form-feedback";
        formFeedback.classList.add(type);
        formFeedback.classList.remove("hide");
    }
}
