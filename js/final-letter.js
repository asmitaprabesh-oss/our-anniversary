
/* RENDER THE FINAL LETTER AND PROMISES */

const letterContainer = document.getElementById("letter-body");
const promisesContainer = document.getElementById("promises-list");

if (letterContainer && Array.isArray(loveLetter)) {
    loveLetter.forEach((paragraphText) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = paragraphText;
        letterContainer.appendChild(paragraph);
    });
}

if (promisesContainer && Array.isArray(promises)) {
    promises.forEach((promise) => {
        const card = document.createElement("article");
        card.className = "promise-card";

        const heart = document.createElement("span");
        heart.className = "promise-heart";
        heart.setAttribute("aria-hidden", "true");
        heart.textContent = "♡";

        const heading = document.createElement("h3");
        heading.textContent = promise.title;

        const description = document.createElement("p");
        description.textContent = promise.text;

        card.append(heart, heading, description);
        promisesContainer.appendChild(card);
    });
}
