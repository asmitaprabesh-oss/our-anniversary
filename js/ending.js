
/* ===================================
   ANNIVERSARY FIREWORKS
=================================== */

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const celebrateButton = document.getElementById("celebrate-again");

let width = 0;
let height = 0;
let particles = [];
let animationFrame;
let lastLaunch = 0;

const colors = [
    "#f06c9b",
    "#ffd166",
    "#ffffff",
    "#c7a6ff",
    "#ff9f68",
    "#f5a6d2"
];

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function launchFirework(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 45 + Math.floor(Math.random() * 25);

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1.2 + Math.random() * 3.5;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            decay: 0.008 + Math.random() * 0.012,
            size: 1.5 + Math.random() * 2,
            color
        });
    }
}

function celebrate() {
    launchFirework(width * 0.25, height * 0.28);
    launchFirework(width * 0.75, height * 0.3);
    launchFirework(width * 0.5, height * 0.18);
}

function animate(timestamp = 0) {
    ctx.clearRect(0, 0, width, height);

    if (timestamp - lastLaunch > 950) {
        if (Math.random() > 0.25) {
            launchFirework(
                width * (0.12 + Math.random() * 0.76),
                height * (0.12 + Math.random() * 0.48)
            );
        }

        lastLaunch = timestamp;
    }

    particles = particles.filter(p => p.alpha > 0.02);

    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += 0.025;
        p.alpha -= p.decay;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationFrame = requestAnimationFrame(animate);
}

resizeCanvas();
animate();

window.addEventListener("resize", resizeCanvas);

celebrateButton.addEventListener("click", () => {
    celebrate();
});

window.addEventListener("pagehide", () => {
    cancelAnimationFrame(animationFrame);
});

/* Respect reduced-motion settings */

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, width, height);

    celebrateButton.addEventListener("click", celebrate);
}
