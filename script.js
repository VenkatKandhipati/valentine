const zone = document.getElementById("zone");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const hint = document.getElementById("hint");

/* ---------- CONFETTI ---------- */
const confettiCanvas = document.getElementById("confettiCanvas");

function resizeConfettiCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    confettiCanvas.style.width = "100vw";
    confettiCanvas.style.height = "100vh";
}

resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);
window.addEventListener("orientationchange", () => setTimeout(resizeConfettiCanvas, 150));

const confettiInstance = confetti.create(confettiCanvas, {
    resize: false,
    useWorker: true
});

function fullScreenConfetti() {
    const end = Date.now() + 1600;

    (function frame() {
        confettiInstance({
            particleCount: 12,
            spread: 90,
            startVelocity: 45,
            ticks: 180,
            origin: { x: Math.random(), y: Math.random() * 0.3 }
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => {
        confettiInstance({
            particleCount: 300,
            spread: 140,
            startVelocity: 60,
            ticks: 220,
            origin: { x: 0.5, y: 0.55 }
        });
    }, 300);
}

/* ---------- FLOATING HEARTS ---------- */
const heartsContainer = document.getElementById("heartsContainer");

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 3 + 4 + "s"; // 4-7s
    heart.style.opacity = Math.random() * 0.5 + 0.1;
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

setInterval(createHeart, 400);

/* ---------- YES BUTTON GROWS ---------- */
let yesScale = 0.8; // Start smaller
yesBtn.style.transform = `translateY(-50%) scale(${yesScale})`;

function growYes(amount = 0.1) {
    yesScale = Math.min(3, yesScale + amount); // Cap at 3x
    yesBtn.style.transform = `translateY(-50%) scale(${yesScale})`;
}

// Automatically grow slowly distinct from the interaction
setInterval(() => {
    growYes(0.001);
}, 100);

/* ---------- NO BUTTON RUNS AWAY & GETS SASSY ---------- */
const noTexts = [
    "No", "Are you sure?", "Really?", "Think again!",
    "Last chance!", "Surely not?", "You might regret this!",
    "Give it another thought!", "Are you absolutely certain?",
    "This could be a mistake!", "Have a heart!",
    "Don't be so cold!", "Change of heart?", "Wouldn't you reconsider?",
    "Is that your final answer?", "You're breaking my heart ;("
];

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function moveNo(px, py) {
    const z = zone.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    let dx = (b.left + b.width / 2) - px;
    let dy = (b.top + b.height / 2) - py;
    let mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;

    let newLeft = (b.left - z.left) + dx * 150;
    let newTop = (b.top - z.top) + dy * 150;

    newLeft = clamp(newLeft, 0, z.width - b.width);
    newTop = clamp(newTop, 0, z.height - b.height);

    noBtn.style.left = newLeft + "px";
    noBtn.style.top = newTop + "px";
    noBtn.style.transform = "none";

    // Change text randomly
    const randomText = noTexts[Math.floor(Math.random() * noTexts.length)];
    noBtn.innerText = randomText;

    growYes(0.1);
}

zone.addEventListener("pointermove", e => {
    const b = noBtn.getBoundingClientRect();
    const d = Math.hypot(
        (b.left + b.width / 2) - e.clientX,
        (b.top + b.height / 2) - e.clientY
    );
    if (d < 140) moveNo(e.clientX, e.clientY);
});

noBtn.addEventListener("click", e => e.preventDefault());

/* ---------- YES CLICK ---------- */
yesBtn.addEventListener("click", () => {
    zone.style.display = "none";
    hint.style.display = "none";     // HIDE THE HINT
    result.style.display = "block";
    resizeConfettiCanvas();
    fullScreenConfetti();
});
