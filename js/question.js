
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const buttonsContainer = document.querySelector(".question-buttons");
const feedback = document.getElementById("question-feedback");
const questionTitle = document.getElementById("question-title");
const questionEmoji = document.querySelector(".question-emoji");
const questionSubtitle = document.querySelector(".question-subtitle");
const questionPage = document.querySelector(".question-page");

let noClicks = 0;
let answered = false;

const playfulMessages = [
    "Aiyoo, feri socha na motu 😚💕",
    "Maya, Yes thichna kati sajilo chha ni 😂💗",
    "La la, aba ta Yes nai thichha hai! 🥰"
];

/* ===================================
   NO BUTTON
   Shrinks each time she clicks it
=================================== */

noButton.addEventListener("click", () => {
    if (answered || noClicks >= 3) {
        return;
    }

    noClicks++;

    buttonsContainer.classList.add("no-clicked");

    if (noClicks >= 2) {
        buttonsContainer.classList.add("twice");
    }

    if (noClicks >= 3) {
        buttonsContainer.classList.add("thrice");
        noButton.setAttribute("aria-hidden", "true");
        noButton.setAttribute("tabindex", "-1");
    }

    feedback.textContent =
        playfulMessages[Math.min(noClicks - 1, playfulMessages.length - 1)];
});

/* ===================================
   YES BUTTON
=================================== */

yesButton.addEventListener("click", () => {
    if (answered) {
        return;
    }

    answered = true;

    buttonsContainer.classList.add("answered");
    questionPage.classList.add("celebrating");

    // Hide the subtitle.
    questionSubtitle.style.display = "none";

    // Show the happy message.
    questionTitle.textContent = "Thank You , maya! 🥰💕";
    questionEmoji.textContent = "🥰💖✨";
    feedback.textContent =
        "I love you too, mayalu! ❤️";

    // Change Yes into the surprise button.
    yesButton.textContent = "Aba surprise hera na 💌";
    yesButton.disabled = false;

    // Navigate to the surprise page when clicked again.
    yesButton.addEventListener("click", () => {
        window.location.href = "surprise.html";
    }, { once: true });
});
