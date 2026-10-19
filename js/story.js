
/* =========================================
   OUR STORY TIMELINE
========================================= */

const timeline = document.getElementById("timeline");

/* =========================================
   GET PHOTOS FROM AN ENTRY
========================================= */

function getEntryImages(entry) {
    if (Array.isArray(entry.images) && entry.images.length > 0) {
        return entry.images
            .map((photo) => {
                if (typeof photo === "string") {
                    return {
                        src: photo,
                        alt: entry.imageAlt || entry.title || "Our memory"
                    };
                }

                if (photo && typeof photo === "object") {
                    return {
                        src: photo.src || photo.image || "",
                        alt: photo.alt || entry.imageAlt || entry.title || "Our memory"
                    };
                }

                return null;
            })
            .filter((photo) => photo && photo.src);
    }

    if (entry.image) {
        return [{
            src: entry.image,
            alt: entry.imageAlt || entry.title || "Our memory"
        }];
    }

    return [];
}

/* =========================================
   CREATE PHOTO COLLAGE
   No placeholder for entries without photos
========================================= */

function createPhotoGallery(entry) {
    const photos = getEntryImages(entry);

    if (photos.length === 0) {
        return null;
    }

    const gallery = document.createElement("div");
    gallery.className = `timeline-image photo-count-${photos.length}`;

    photos.forEach((photo, index) => {
        const tile = document.createElement("div");
        tile.className = "timeline-photo-tile";
        tile.tabIndex = 0;
        tile.setAttribute("role", "button");
        tile.setAttribute(
            "aria-label",
            `Open photo ${index + 1}: ${photo.alt}`
        );

        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = "lazy";
        image.decoding = "async";

        image.addEventListener("error", () => {
            tile.classList.add("photo-failed");
            console.error("Could not load photo:", photo.src);
        });

        tile.appendChild(image);
        gallery.appendChild(tile);
    });

    return gallery;
}

/* =========================================
   CREATE TIMELINE TEXT
========================================= */

function createTimelineContent(entry) {
    const content = document.createElement("div");
    content.className = "timeline-content";

    if (entry.date) {
        const date = document.createElement("span");
        date.className = "timeline-date";
        date.textContent = entry.date;
        content.appendChild(date);
    }

    if (entry.title) {
        const title = document.createElement("h2");
        title.textContent = entry.title;
        content.appendChild(title);
    }

    if (entry.text) {
        const paragraphs = Array.isArray(entry.text)
            ? entry.text
            : String(entry.text).split(/\n\s*\n/);

        paragraphs.forEach((paragraphText) => {
            const cleanText = String(paragraphText).trim();

            if (!cleanText) return;

            const paragraph = document.createElement("p");
            paragraph.textContent = cleanText;
            content.appendChild(paragraph);
        });
    }

    if (entry.caption) {
        const caption = document.createElement("div");
        caption.className = "timeline-caption";
        caption.textContent = entry.caption;
        content.appendChild(caption);
    }

    return content;
}

/* =========================================
   RENDER TIMELINE
========================================= */

function renderTimeline() {
    if (!timeline) {
        console.error('Could not find the element with id="timeline".');
        return;
    }

    if (!Array.isArray(window.timelineEntries)) {
        console.error(
            "Timeline data not found. Check content/timeline.js."
        );
        return;
    }

    timeline.replaceChildren();

    window.timelineEntries.forEach((entry) => {
        const article = document.createElement("article");
        article.className = "timeline-entry";

        if (entry.type === "note") {
            article.classList.add("timeline-entry-note");
        }

        const card = document.createElement("div");
        card.className = "timeline-card";

        const gallery = createPhotoGallery(entry);
        const content = createTimelineContent(entry);

        // Only add the photo collage when photos actually exist.
        if (gallery) {
            card.appendChild(gallery);
        }

        card.appendChild(content);
        article.appendChild(card);
        timeline.appendChild(article);
    });

    observeTimelineEntries();
}

/* =========================================
   TIMELINE SCROLL REVEAL
========================================= */

function observeTimelineEntries() {
    const entries = document.querySelectorAll(".timeline-entry");

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
    ) {
        entries.forEach((entry) => entry.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (observedEntries, currentObserver) => {
            observedEntries.forEach((item) => {
                if (item.isIntersecting) {
                    item.target.classList.add("is-visible");
                    currentObserver.unobserve(item.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    entries.forEach((entry) => observer.observe(entry));
}

/* =========================================
   IMAGE LIGHTBOX
========================================= */

let lightbox;
let lightboxImage;
let lightboxCaption;
let lightboxClose;
let previouslyFocusedElement = null;
let closeTimer = null;

function createLightbox() {
    if (lightbox) return;

    lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged memory photo");

    lightboxClose = document.createElement("button");
    lightboxClose.className = "image-lightbox-close";
    lightboxClose.type = "button";
    lightboxClose.textContent = "×";
    lightboxClose.setAttribute("aria-label", "Close enlarged photo");

    lightboxImage = document.createElement("img");
    lightboxImage.className = "image-lightbox-image";
    lightboxImage.alt = "";

    lightboxCaption = document.createElement("p");
    lightboxCaption.className = "image-lightbox-caption";

    lightbox.append(
        lightboxClose,
        lightboxImage,
        lightboxCaption
    );

    document.body.appendChild(lightbox);

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxImage.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("keydown", handleLightboxKeyboard);
}

/* =========================================
   OPEN PHOTO
========================================= */

function openLightbox(image) {
    if (!image || !image.src) return;

    createLightbox();
    window.clearTimeout(closeTimer);

    previouslyFocusedElement = document.activeElement;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Our memory";
    lightboxCaption.textContent = image.alt || "";

    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");

    requestAnimationFrame(() => {
        lightboxClose.focus({ preventScroll: true });
    });
}

/* =========================================
   CLOSE PHOTO
========================================= */

function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains("is-open")) {
        return;
    }

    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");

    const finishClosing = () => {
        if (lightbox.classList.contains("is-open")) return;

        lightboxImage.removeAttribute("src");
        lightboxCaption.textContent = "";

        if (
            previouslyFocusedElement &&
            document.contains(previouslyFocusedElement)
        ) {
            previouslyFocusedElement.focus({ preventScroll: true });
        }
    };

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        finishClosing();
    } else {
        closeTimer = window.setTimeout(finishClosing, 320);
    }
}

/* =========================================
   LIGHTBOX KEYBOARD CONTROLS
========================================= */

function handleLightboxKeyboard(event) {
    if (!lightbox || !lightbox.classList.contains("is-open")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "Tab") {
        event.preventDefault();
        lightboxClose.focus();
    }
}

/* =========================================
   PHOTO CLICK AND KEYBOARD INTERACTION
========================================= */

if (timeline) {
    timeline.addEventListener("click", (event) => {
        const tile = event.target.closest(".timeline-photo-tile");

        if (!tile || !timeline.contains(tile)) return;

        const image = tile.querySelector("img");

        if (image && image.complete && image.naturalWidth > 0) {
            openLightbox(image);
        }
    });

    timeline.addEventListener("keydown", (event) => {
        const tile = event.target.closest(".timeline-photo-tile");

        if (!tile || !timeline.contains(tile)) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            const image = tile.querySelector("img");

            if (image && image.complete && image.naturalWidth > 0) {
                openLightbox(image);
            }
        }
    });
}

/* =========================================
   START
========================================= */

renderTimeline();
