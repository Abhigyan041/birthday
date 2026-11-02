
"use strict";

// ======================================
// ALISHA'S GOLDEN BIRTHDAY WEBSITE
// ======================================

// CUSTOM SETTINGS
const SETTINGS = {
    name: "Alisha",
    password: "0511",
    birthdayMonth: 10, // November (0 = January)
    birthdayDay: 5
};

// ======================================
// NAVIGATION
// ======================================

function showPage(pageId) {
    const page = document.getElementById(pageId);

    if (!page) return;

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    page.classList.add("active");

    document.getElementById("navigation").classList.remove("open");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
    document.getElementById("navigation").classList.toggle("open");
}

// ======================================
// COUNTDOWN
// ======================================

function updateCountdown() {
    const now = new Date();

    let target = new Date(
        now.getFullYear(),
        SETTINGS.birthdayMonth,
        SETTINGS.birthdayDay,
        0, 0, 0
    );

    if (now >= target) {
        target.setFullYear(target.getFullYear() + 1);
    }

    const difference = Math.max(0, target - now);

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference / 3600000) % 24;
    const minutes = Math.floor(difference / 60000) % 60;
    const seconds = Math.floor(difference / 1000) % 60;

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ======================================
// SECRET LETTERS
// ======================================

const letters = [
    {
        title: "Dear Alisha ♡",
        content: `Hey Alisha!

First of all, a very happy birthday to you!

I wanted to make something different for your
special day instead of sending an ordinary message.

So here is a little website made specially for you.

I hope exploring it makes you smile.

Keep being yourself and enjoy your special day!

Your best friend ♡`
    },
    {
        title: "Why You're Special",
        content: `Some friendships are simply beautiful.

Thank you for the conversations, laughter,
random moments and memories.

A good friend is someone who makes ordinary
moments feel special.

I'm grateful for this friendship.

Never stop being the wonderful person you are!`
    },
    {
        title: "A Wish For Your Future",
        content: `Dear Alisha,

I wish you success in everything you do.

May your dreams become reality.
May you find happiness in little things.
May new opportunities find their way to you.

And most importantly, may you always have
a reason to smile.

Here's to a beautiful new chapter!`
    },
    {
        title: "One Last Thing",
        content: `Alisha,

Life is full of changes, new people and new
chapters, but beautiful friendships deserve
to be appreciated.

Thank you for being a part of my journey.

I hope we create many more memories together.

Happy Birthday once again!

Stay happy, stay blessed and keep shining. ♡`
    }
];

function openLetter(index) {
    const letter = letters[index];

    document.getElementById("letterTitle").textContent =
        letter.title;

    document.getElementById("letterContent").textContent =
        letter.content;

    document.getElementById("letterView").classList.remove("hidden");

    document.getElementById("letterView").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function closeLetter() {
    document.getElementById("letterView").classList.add("hidden");
}

// ======================================
// BACKGROUND MUSIC
// Generated ambient music using Web Audio
// ======================================

let audioContext = null;
let musicNodes = [];
let musicOn = false;

function toggleMusic() {
    if (musicOn) {
        stopMusic();
    } else {
        startMusic();
    }
}

function startMusic() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            showToast("Your browser does not support audio.");
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        audioContext.resume();

        const master = audioContext.createGain();
        master.gain.value = 0.035;
        master.connect(audioContext.destination);

        // Gentle ambient chords
        const frequencies = [130.81, 164.81, 196.00, 261.63];

        frequencies.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = frequency;

            gain.gain.value = index === 0 ? 0.5 : 0.2;

            oscillator.connect(gain);
            gain.connect(master);

            oscillator.start();

            musicNodes.push(oscillator, gain);
        });

        musicNodes.push(master);
        musicOn = true;

        document.getElementById("musicBtn").textContent =
            "♫ Music: ON";

    } catch (error) {
        showToast("Could not start music.");
    }
}

function stopMusic() {
    musicNodes.forEach(node => {
        try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
        } catch (error) {}
    });

    musicNodes = [];
    musicOn = false;

    document.getElementById("musicBtn").textContent =
        "♫ Music: OFF";
}

// ======================================
// GAME PROGRESS
// ======================================

const completedGames = new Set();

function completeGame(game) {
    completedGames.add(game);

    const status = document.getElementById("status-" + game);

    if (status) {
        status.textContent = "✓ COMPLETED";
        status.style.color = "#d6b36a";
    }

    const count = completedGames.size;

    document.getElementById("progressText").textContent =
        `${count} / 6 Completed`;

    document.getElementById("progressBar").style.width =
        (count / 6 * 100) + "%";

    if (count === 6) {
        showToast("All games completed! The treasure is yours! ✨");
    }
}

// ======================================
// GAME WINDOW
// ======================================

function openGame(title, content) {
    document.getElementById("gameTitle").textContent = title;

    document.getElementById("gameContent").innerHTML = content;

    document.getElementById("gameWindow").classList.remove("hidden");

    document.getElementById("gameWindow").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

let activeGameCleanup = null;

function closeGame() {
    if (activeGameCleanup) {
        activeGameCleanup();
        activeGameCleanup = null;
    }

    document.getElementById("gameWindow").classList.add("hidden");
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ======================================
// GAME 1: MEMORY MATCH
// ======================================

let memoryFirst = null;
let memoryLocked = false;
let memoryMatches = 0;

function startMemory() {
    closePreviousGame();

    const emojis = [
        "👑", "👑", "💎", "💎",
        "🌹", "🌹", "🎂", "🎂",
        "⭐", "⭐", "🎁", "🎁",
        "🦋", "🦋", "💗", "💗"
    ];

    emojis.sort(() => Math.random() - 0.5);

    memoryFirst = null;
    memoryLocked = false;
    memoryMatches = 0;

    const cards = emojis.map((emoji, index) => `
        <button class="memory-card"
            id="memory-${index}"
            onclick="flipMemory(${index})"
            data-value="${emoji}">
            ?
        </button>
    `).join("");

    openGame("Memory Match ♛", `
        <p class="game-instructions">
            Find all eight matching pairs.
        </p>
        <h3 class="game-score" id="memoryScore">Pairs: 0 / 8</h3>
        <div class="memory-grid">${cards}</div>
    `);
}

function flipMemory(index) {
    if (memoryLocked) return;

    const card = document.getElementById("memory-" + index);

    if (!card || card.disabled) return;
    if (memoryFirst === index) return;

    card.textContent = card.dataset.value;

    if (memoryFirst === null) {
        memoryFirst = index;
        return;
    }

    const firstIndex = memoryFirst;
    const firstCard = document.getElementById(
        "memory-" + firstIndex
    );

    if (firstCard.dataset.value === card.dataset.value) {
        firstCard.disabled = true;
        card.disabled = true;

        memoryFirst = null;
        memoryMatches++;

        document.getElementById("memoryScore").textContent =
            `Pairs: ${memoryMatches} / 8`;

        if (memoryMatches === 8) {
            completeGame("memory");

            document.getElementById("gameContent").innerHTML = `
                <h2>Perfect Match! ✨</h2>
                <p class="game-instructions">
                    You found every golden pair!
                </p>
                <h3 class="game-score">Congratulations, Alisha!</h3>
            `;
        }

    } else {
        memoryLocked = true;

        setTimeout(() => {
            if (document.getElementById("memory-" + firstIndex)) {
                firstCard.textContent = "?";
            }

            if (document.getElementById("memory-" + index)) {
                card.textContent = "?";
            }

            memoryFirst = null;
            memoryLocked = false;

        }, 850);
    }
}

// ======================================
// GAME 2: CATCH HEARTS
// ======================================

function startHearts() {
    closePreviousGame();

    let score = 0;
    let time = 20;
    let ended = false;

    openGame("Catch The Golden Hearts ♡", `
        <p class="game-instructions">
            You have 20 seconds. Click the hearts to collect points!
        </p>
        <h3 class="game-score">
            Score: <span id="heartScore">0</span>
            &nbsp; | &nbsp;
            Time: <span id="heartTime">20</span>
        </h3>
        <div class="heart-arena" id="heartArena"></div>
        <p id="heartResult"></p>
    `);

    const arena = document.getElementById("heartArena");

    const spawn = setInterval(() => {
        if (ended || !arena.isConnected) return;

        const heart = document.createElement("button");

        heart.className = "falling-heart";
        heart.textContent = Math.random() > 0.5 ? "💗" : "💛";

        heart.style.left = Math.random() * 88 + "%";
        heart.style.top = Math.random() * 80 + "%";

        heart.onclick = () => {
            if (ended) return;

            score++;

            document.getElementById("heartScore").textContent =
                score;

            heart.remove();
        };

        arena.appendChild(heart);

        setTimeout(() => heart.remove(), 1200);

    }, 500);

    const clock = setInterval(() => {
        if (!arena.isConnected) {
            cleanup();
            return;
        }

        time--;

        document.getElementById("heartTime").textContent = time;

        if (time <= 0) {
            ended = true;
            cleanup();

            document.getElementById("heartResult").textContent =
                `You collected ${score} hearts!`;

            if (score >= 5) {
                completeGame("hearts");
            } else {
                document.getElementById("heartResult").textContent +=
                    " Collect at least 5 to complete the game!";
            }
        }

    }, 1000);

    function cleanup() {
        clearInterval(spawn);
        clearInterval(clock);
    }

    activeGameCleanup = cleanup;
}

// ======================================
// GAME 3: BIRTHDAY QUIZ
// ======================================

const quizQuestions = [
    {
        question: "Which day is Alisha's birthday?",
        options: ["3 November", "5 November", "10 November"],
        answer: 1
    },
    {
        question: "What makes a friendship beautiful?",
        options: [
            "Trust and laughter",
            "Competition",
            "Expensive gifts"
        ],
        answer: 0
    },
    {
        question: "What is the theme of this website?",
        options: [
            "Blue and silver",
            "Black and golden",
            "Pink and white"
        ],
        answer: 1
    },
    {
        question: "What is the most important birthday gift?",
        options: [
            "A big cake",
            "A new phone",
            "Love and good memories"
        ],
        answer: 2
    }
];

let quizIndex = 0;
let quizScore = 0;

function startQuiz() {
    closePreviousGame();

    quizIndex = 0;
    quizScore = 0;

    renderQuiz();
}

function renderQuiz() {
    if (quizIndex >= quizQuestions.length) {
        const passed = quizScore >= 2;

        if (passed) completeGame("quiz");

        openGame("Quiz Completed ✨", `
            <h2>${quizScore} / 4</h2>
            <p class="game-instructions">
                ${passed
                    ? "Wonderful! You completed the birthday quiz."
                    : "Good try! You need at least 2 correct answers."}
            </p>
            <button class="gold-button"
                onclick="startQuiz()">PLAY AGAIN</button>
        `);

        return;
    }

    const q = quizQuestions[quizIndex];

    const options = q.options.map((option, index) => `
        <button class="game-option"
            onclick="answerQuiz(${index})">
            ${option}
        </button>
    `).join("");

    openGame("Birthday Quiz ✦", `
        <p class="game-instructions">
            Question ${quizIndex + 1} of ${quizQuestions.length}
        </p>
        <h3>${q.question}</h3>
        ${options}
        <p class="game-score">Score: ${quizScore}</p>
    `);
}

function answerQuiz(index) {
    if (quizQuestions[quizIndex].answer === index) {
        quizScore++;
        showToast("Correct! ✨");
    } else {
        showToast("Nice try! Next question.");
    }

    quizIndex++;

    setTimeout(renderQuiz, 450);
}

// ======================================
// GAME 4: LUCKY WHEEL
// ======================================

const wheelRewards = [
    "A year full of happiness! ♡",
    "A beautiful surprise! 🎁",
    "Unlimited success! ✨",
    "A lifetime of friendship! 💛",
    "Dreams coming true! 🌟",
    "Endless laughter! 🌹"
];

function startWheel() {
    closePreviousGame();

    openGame("The Golden Lucky Wheel", `
        <p class="game-instructions">
            Spin the wheel and receive your birthday wish.
        </p>
        <div class="wheel" id="luckyWheel">♛</div>
        <h3 id="wheelResult" class="game-score">
            Your luck is waiting...
        </h3>
        <button class="gold-button" id="spinBtn"
            onclick="spinWheel()">SPIN THE WHEEL</button>
    `);
}

function spinWheel() {
    const wheel = document.getElementById("luckyWheel");
    const button = document.getElementById("spinBtn");

    if (!wheel || !button || button.disabled) return;

    button.disabled = true;

    const rewardIndex = Math.floor(
        Math.random() * wheelRewards.length
    );

    wheel.animate([
        { transform: "rotate(0deg)" },
        { transform: "rotate(1800deg)" }
    ], {
        duration: 2500,
        easing: "ease-out"
    });

    setTimeout(() => {
        document.getElementById("wheelResult").textContent =
            wheelRewards[rewardIndex];

        button.disabled = false;
        completeGame("wheel");

    }, 2500);
}

// ======================================
// GAME 5: TREASURE HUNT
// ======================================

const treasureClues = [
    {
        clue: "I have many pages but I am not a website. What am I?",
        options: ["A book", "A clock", "A mirror"],
        answer: 0
    },
    {
        clue: "I shine at night and look beautiful in the sky. What am I?",
        options: ["A flower", "A star", "A shoe"],
        answer: 1
    },
    {
        clue: "I keep memories alive without speaking a word. What am I?",
        options: ["A photo", "A spoon", "A window"],
        answer: 0
    }
];

let treasureIndex = 0;

function startTreasure() {
    closePreviousGame();

    treasureIndex = 0;

    renderTreasure();
}

function renderTreasure() {
    if (treasureIndex >= treasureClues.length) {
        completeGame("treasure");

        openGame("Treasure Discovered! ♛", `
            <div style="font-size:75px">💎</div>
            <h2>You Found The Treasure!</h2>
            <p class="game-instructions">
                Your treasure is a collection of beautiful memories
                and a special birthday wish.
            </p>
        `);

        return;
    }

    const clue = treasureClues[treasureIndex];

    const options = clue.options.map((option, index) => `
        <button class="game-option"
            onclick="answerTreasure(${index})">
            ${option}
        </button>
    `).join("");

    openGame("Golden Treasure Hunt", `
        <p class="game-instructions">
            CLUE ${treasureIndex + 1} OF 3
        </p>
        <div class="clue-box">${clue.clue}</div>
        ${options}
        <p class="game-score">
            Complete all three clues to find the treasure.
        </p>
    `);
}

function answerTreasure(index) {
    if (treasureClues[treasureIndex].answer === index) {
        treasureIndex++;
        showToast("Correct clue! Follow the trail. ✨");
        renderTreasure();
    } else {
        showToast("Not quite! Try another answer.");
    }
}

// ======================================
// GAME 6: GUESS THE SONG
// ======================================

// Short melodies made from public-domain tunes.

const melodies = [
    {
        name: "Twinkle Twinkle Little Star",
        options: [
            "Twinkle Twinkle Little Star",
            "Ode to Joy",
            "Happy Birthday"
        ],
        answer: 0,
        notes: [261.63, 261.63, 392, 392, 440, 440, 392]
    },
    {
        name: "Ode to Joy",
        options: [
            "Happy Birthday",
            "Ode to Joy",
            "Twinkle Twinkle Little Star"
        ],
        answer: 1,
        notes: [329.63, 329.63, 349.23, 392, 392, 349.23, 329.63]
    },
    {
        name: "Happy Birthday",
        options: [
            "Ode to Joy",
            "Twinkle Twinkle Little Star",
            "Happy Birthday"
        ],
        answer: 2,
        notes: [261.63, 261.63, 293.66, 261.63, 349.23, 329.63]
    }
];

let currentSong = 0;
let songPlayed = false;

function startSong() {
    closePreviousGame();

    currentSong = Math.floor(Math.random() * melodies.length);
    songPlayed = false;

    const options = melodies[currentSong].options.map(
        (option, index) => `
            <button class="game-option"
                onclick="answerSong(${index})">
                ${option}
            </button>
        `
    ).join("");

    openGame("Guess The Song ♫", `
        <p class="game-instructions">
            Press the play button, listen carefully,
            and identify the tune.
        </p>
        <div style="font-size:65px;color:#d6b36a">♫</div>
        <button class="gold-button"
            onclick="playSong()">▶ PLAY TUNE</button>
        <div class="gold-divider"></div>
        <h3>Which song did you hear?</h3>
        ${options}
        <p id="songFeedback" class="game-score"></p>
    `);
}

async function playSong() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            showToast("Audio is not supported in this browser.");
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        await audioContext.resume();

        const song = melodies[currentSong];

        songPlayed = true;

        song.notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            const start = audioContext.currentTime + index * 0.38;

            oscillator.type = "sine";
            oscillator.frequency.value = frequency;

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.16, start + 0.03);
            gain.gain.setValueAtTime(0.16, start + 0.24);
            gain.gain.linearRampToValueAtTime(0, start + 0.34);

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start(start);
            oscillator.stop(start + 0.36);
        });

    } catch (error) {
        showToast("Unable to play the tune.");
    }
}

function answerSong(index) {
    if (!songPlayed) {
        showToast("Listen to the tune first!");
        return;
    }

    const correct = melodies[currentSong].answer === index;

    if (correct) {
        document.getElementById("songFeedback").textContent =
            "Correct! You have a great ear! 🎵";

        completeGame("song");
    } else {
        document.getElementById("songFeedback").textContent =
            "Not quite! Try playing the tune again.";
    }
}

// ======================================
// SECRET ROOM
// ======================================

function unlockSecret() {
    const entered =
        document.getElementById("secretCode").value;

    const message =
        document.getElementById("lockMessage");

    if (entered === SETTINGS.password) {
        document.getElementById("secretLetter")
            .classList.remove("hidden");

        message.textContent = "ACCESS GRANTED ✨";

        showToast("Welcome to your secret room!");

        document.getElementById("secretLetter").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } else {
        message.textContent = "Incorrect code. Please try again.";
    }
}

// ======================================
// FINAL CELEBRATION
// ======================================

function celebrate() {
    const symbols = ["✦", "✨", "♡", "💛", "🎉", "🌟"];

    for (let i = 0; i < 65; i++) {
        const item = document.createElement("div");

        item.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        item.style.position = "fixed";
        item.style.left = Math.random() * 100 + "vw";
        item.style.top = "-30px";
        item.style.fontSize = (15 + Math.random() * 20) + "px";
        item.style.color = "#d6b36a";
        item.style.pointerEvents = "none";
        item.style.zIndex = "9999";

        document.body.appendChild(item);

        const duration = 2000 + Math.random() * 2500;

        const animation = item.animate([
            {
                transform: "translateY(0) rotate(0deg)",
                opacity: 1
            },
            {
                transform:
                    `translateY(110vh) rotate(${Math.random() * 800}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: "ease-out"
        });

        animation.onfinish = () => item.remove();
    }

    showToast("Happy Birthday, Alisha! ♛");
}

// ======================================
// DECORATIVE BACKGROUND
// ======================================

function createSparkles() {
    const container = document.getElementById("sparkles");

    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement("span");

        sparkle.className = "sparkle";
        sparkle.textContent = "✦";
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.top = Math.random() * 100 + "vh";
        sparkle.style.fontSize = (7 + Math.random() * 10) + "px";
        sparkle.style.animationDelay = Math.random() * 3 + "s";

        container.appendChild(sparkle);
    }
}

createSparkles();

// ======================================
// CLEANUP
// ======================================

function closePreviousGame() {
    if (activeGameCleanup) {
        activeGameCleanup();
        activeGameCleanup = null;
    }

    document.getElementById("gameWindow").classList.add("hidden");
}
