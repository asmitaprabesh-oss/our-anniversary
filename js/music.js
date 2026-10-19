
/* SHARED ROMANTIC AMBIENT MUSIC */

(() => {
    const storageKey = "anniversaryMusicEnabled";
    const timeKey = "anniversaryMusicTime";

    const isInsidePagesFolder =
        window.location.pathname.includes("/pages/");

    const audioPath = isInsidePagesFolder
        ? "../assets/audio/romantic-ambience.mp3"
        : "assets/audio/romantic-ambience.mp3";

    const audio = document.createElement("audio");
    audio.src = audioPath;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.25;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "music-toggle";
    button.setAttribute("aria-pressed", "false");

    const symbol = document.createElement("span");
    symbol.className = "music-symbol";
    symbol.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");

    button.append(symbol, label);
    document.body.appendChild(button);

    let musicEnabled = false;
    let savedTime = 0;

    try {
        musicEnabled = localStorage.getItem(storageKey) === "true";
        savedTime = Number(sessionStorage.getItem(timeKey)) || 0;
    } catch {}

    function updateButton(isPlaying) {
    symbol.textContent = isPlaying ? "Ⅱ" : "♪";
    label.textContent = isPlaying ? "Stop music" : "Play music";

    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute(
        "aria-label",
        isPlaying ? "Stop background music" : "Play background music"
    );
    }

    // Restore the saved position when the audio metadata is ready.
    audio.addEventListener("loadedmetadata", async () => {
    if (savedTime > 0 && Number.isFinite(audio.duration)) {
        audio.currentTime = savedTime % audio.duration;
    }

    if (musicEnabled) {
        await playMusic();
    } else {
        updateButton(false);
    }
    }, { once: true });

    // Remember the current position for the next page.
    function saveTime() {
        try {
            sessionStorage.setItem(timeKey, String(audio.currentTime));
        } catch {}
    }

    audio.addEventListener("timeupdate", saveTime);
    window.addEventListener("pagehide", saveTime);

    async function playMusic() {
        try {
            await audio.play();
            musicEnabled = true;

            try {
                localStorage.setItem(storageKey, "true");
            } catch {}

            updateButton(true);
        } catch (error) {
            updateButton(false);
            console.info("Music could not start:", error);
        }
    }

    function pauseMusic() {
        saveTime();
        audio.pause();
        musicEnabled = false;

        try {
            localStorage.setItem(storageKey, "false");
        } catch {}

        updateButton(false);
    }

    button.addEventListener("click", () => {
    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
    });

    audio.addEventListener("error", () => {
        updateButton(false);
        label.textContent = "Music unavailable";
        console.warn("Check assets/audio/romantic-ambience.mp3");
    });

    updateButton(false);

    // Load audio metadata so the previous position can be restored.
    // Load audio metadata and restore the previous playback position.
    audio.load();

    if (musicEnabled) {
    label.textContent = "Resuming music...";
    }
})();
