
/* =========================================
   ENVELOPE INTERACTION
========================================= */

const envelopeButton = document.getElementById("envelope-button");
const envelopeHint = document.getElementById("envelope-hint");
const letterContent = document.getElementById("letter-content");
const continueButton = document.getElementById("continue-button");

let letterOpened = false;

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

/* =========================================
   OPEN THE ENVELOPE
========================================= */

envelopeButton.addEventListener("click", () => {
    if (letterOpened) {
        return;
    }

    letterOpened = true;

    envelopeButton.classList.add("open");
    envelopeButton.setAttribute("aria-expanded", "true");
    envelopeButton.setAttribute("aria-label", "Your love letter is open");

    envelopeHint.textContent = "For you, straight from my heart ♡";

    const revealDelay = prefersReducedMotion.matches ? 0 : 700;

    window.setTimeout(() => {
        letterContent.hidden = false;

        letterContent.scrollIntoView({
            behavior: prefersReducedMotion.matches ? "auto" : "smooth",
            block: "start"
        });
    }, revealDelay);
});

/* =========================================
   CONTINUE TO OUR STORY
========================================= */

continueButton.addEventListener("click", () => {
    window.location.href = "our-story.html";
});
