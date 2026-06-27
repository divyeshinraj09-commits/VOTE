const screens = {
    alert: document.querySelector("#alertScreen"),
    loading: document.querySelector("#loadingScreen"),
    campaign: document.querySelector("#campaignScreen"),
};

const enterButton = document.querySelector("#enterButton");
const continueButton = document.querySelector("#continueButton");
const generateButton = document.querySelector("#generateButton");
const restartButton = document.querySelector("#restartButton");
const stats = document.querySelectorAll(".stat");
const finalPanel = document.querySelector("#finalPanel");
const builderPanel = document.querySelector("#builderPanel");
const generatorPanel = document.querySelector("#generatorPanel");
const resultPanel = document.querySelector("#resultPanel");
const generatorTitle = document.querySelector("#generatorTitle");
const scanLines = document.querySelector("#scanLines");
const voteRain = document.querySelector("#voteRain");
const popupZone = document.querySelector("#popupZone");
const confettiCanvas = document.querySelector("#confettiCanvas");
const confettiContext = confettiCanvas.getContext("2d");

let confettiPieces = [];
let confettiFrame;
let finalCelebrated = false;
let voteInterval;
let popupInterval;

function showScreen(name) {
    Object.values(screens).forEach((screen) => screen.classList.remove("active"));
    screens[name].classList.add("active");
}

function typeText(element, speed = 38) {
    const text = element.dataset.text || "";
    element.textContent = "";
    [...text].forEach((character, index) => {
        window.setTimeout(() => { element.textContent += character; }, index * speed);
    });
}

function runTypingAnimations(scope = document) {
    scope.querySelectorAll(".typing-text").forEach((element) => typeText(element));
}

function fillStats() {
    stats.forEach((stat, index) => {
        const value = stat.dataset.value;
        const bar = stat.querySelector(".bar span");
        window.setTimeout(() => { bar.style.width = value + "%"; }, 240 + index * 260);
    });
}

function resetStats() {
    stats.forEach((stat) => { stat.querySelector(".bar span").style.width = "0"; });
}

function beginExperience() {
    resetStats();
    finalCelebrated = false;
    stopVoteRain();
    showScreen("loading");
    runTypingAnimations(screens.loading);
    fillStats();

    window.setTimeout(() => {
        showScreen("campaign");
        runTypingAnimations(screens.campaign);
        window.scrollTo({ top: 0, behavior: "smooth" });
        showRandomPopup("Bro actually found the candidate 💀");
    }, 3300);
}

function resizeCanvas() {
    confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
    confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
    confettiContext.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createConfetti() {
    const colors = ["#35f7ff", "#a7ff47", "#ff4fd8", "#ffd166", "#f6f8ff"];
    confettiPieces = Array.from({ length: 120 }, () => ({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.4,
        size: 5 + Math.random() * 8,
        speed: 2 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        spin: -0.16 + Math.random() * 0.32,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));
}

function animateConfetti() {
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiPieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += Math.sin(piece.angle) * 1.8;
        piece.angle += piece.spin;
        confettiContext.save();
        confettiContext.translate(piece.x, piece.y);
        confettiContext.rotate(piece.angle);
        confettiContext.fillStyle = piece.color;
        confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.58);
        confettiContext.restore();
    });
    confettiPieces = confettiPieces.filter((piece) => piece.y < window.innerHeight + 40);
    if (confettiPieces.length > 0) confettiFrame = requestAnimationFrame(animateConfetti);
    else confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function launchConfetti() {
    cancelAnimationFrame(confettiFrame);
    resizeCanvas();
    createConfetti();
    animateConfetti();
}

function showRandomPopup(forcedText) {
    const messages = [
        "Bro actually found the candidate 💀",
        "Rare achievement unlocked 🏆",
        "No boring speeches detected ✅",
        "Vibe check: Passed 😎",
    ];
    const popup = document.createElement("div");
    popup.className = "toast-pop";
    popup.style.setProperty("--top", Math.floor(12 + Math.random() * 58) + "%");
    popup.textContent = forcedText || messages[Math.floor(Math.random() * messages.length)];
    popupZone.appendChild(popup);
    window.setTimeout(() => popup.remove(), 3300);
}

function startPopups() {
    clearInterval(popupInterval);
    showRandomPopup("Rare achievement unlocked 🏆");
    popupInterval = window.setInterval(() => showRandomPopup(), 2400);
    window.setTimeout(() => clearInterval(popupInterval), 12000);
}

function createVoteMessage() {
    const messages = [
        "🔥 VOTE FOR DIVYESH",
        "🔥 DIVYESH FOR IT HEAD",
        "🔥 #DIVYESH2026",
        "🔥 BEST UPDATE AVAILABLE",
        "🔥 IT HEAD LOADING...",
        "🔥 SYSTEM UPDATED",
        "🔥 DIVYESH.EXE ONLINE",
    ];
    const item = document.createElement("span");
    item.className = "floating-vote";
    item.textContent = messages[Math.floor(Math.random() * messages.length)];
    item.style.setProperty("--x", Math.floor(Math.random() * 92) + "vw");
    item.style.setProperty("--duration", (4 + Math.random() * 4).toFixed(2) + "s");
    item.style.setProperty("--color", ["#35f7ff", "#a7ff47", "#ff4fd8", "#ffd166"][Math.floor(Math.random() * 4)]);
    voteRain.appendChild(item);
    window.setTimeout(() => item.remove(), 8200);
}

function startVoteRain() {
    stopVoteRain();
    for (let index = 0; index < 28; index += 1) {
        window.setTimeout(createVoteMessage, index * 90);
    }
    voteInterval = window.setInterval(createVoteMessage, 220);
    window.setTimeout(() => clearInterval(voteInterval), 10000);
}

function stopVoteRain() {
    clearInterval(voteInterval);
    clearInterval(popupInterval);
    voteRain.innerHTML = "";
    popupZone.innerHTML = "";
}

function generateCandidate() {
    generatorPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    scanLines.innerHTML = "";
    generatorPanel.scrollIntoView({ behavior: "smooth", block: "center" });

    const steps = [
        "Analysing your expectations...",
        "Matching qualities...",
        "Searching database...",
        "Candidate found ✅",
    ];

    steps.forEach((step, index) => {
        window.setTimeout(() => {
            generatorTitle.textContent = step;
            const line = document.createElement("p");
            line.textContent = "> " + step;
            scanLines.appendChild(line);
        }, index * 850);
    });

    window.setTimeout(() => {
        resultPanel.classList.remove("hidden");
        resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        launchConfetti();
        showRandomPopup("No boring speeches detected ✅");
    }, 3800);
}

const finalObserver = new IntersectionObserver(
    (entries) => {
        const finalVisible = entries.some((entry) => entry.isIntersecting);
        if (finalVisible && !finalCelebrated && screens.campaign.classList.contains("active")) {
            finalCelebrated = true;
            launchConfetti();
            startVoteRain();
            startPopups();
        }
    },
    { threshold: 0.42 }
);

enterButton.addEventListener("click", beginExperience);
continueButton.addEventListener("click", () => builderPanel.scrollIntoView({ behavior: "smooth", block: "start" }));
generateButton.addEventListener("click", generateCandidate);
restartButton.addEventListener("click", () => {
    cancelAnimationFrame(confettiFrame);
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stopVoteRain();
    generatorPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    scanLines.innerHTML = "";
    showScreen("alert");
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("resize", resizeCanvas);
finalObserver.observe(finalPanel);
resizeCanvas();
