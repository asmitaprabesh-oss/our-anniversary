
/* ANNIVERSARY COUNTDOWN */

(() => {
    // October 20, 2026, at 12:00 AM Nepal time (UTC+05:45)
    const releaseTime = new Date("2026-10-20T00:00:00+05:45").getTime();

    const questionPage = "pages/question.html";

    const elements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    function updateCountdown() {
        const remaining = releaseTime - Date.now();

        if (remaining <= 0) {
            window.location.replace(questionPage);
            return;
        }

        elements.days.textContent =
            String(Math.floor(remaining / 86400000)).padStart(2, "0");

        elements.hours.textContent =
            String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");

        elements.minutes.textContent =
            String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");

        elements.seconds.textContent =
            String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();
