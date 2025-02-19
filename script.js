const words = ["BOAT", "CAT", "DOG", "FISH", "BIRD", "LION", "TIGER", "BEAR"];
let usedWords = new Set();
let currentWord = "";
let scrambledLetters = [];
let selectedLetters = [];
let timeLeft = 30;
let score = 0;
let timerInterval;

const gameBox = document.getElementById("game-box");

function startGame() {
  gameBox.innerHTML = `
  <div class="status">
  <span>Score: <strong id="score">0</strong></span>
  <span>Time: <strong id="timer">30</strong>s</span>
  </div>
  <div id="msg" class="message"></div>
  <div id="wordDisplay" class="word-display"></div>
  <div id="letters" class="letters-container"></div>
  `;

  // Reassign UI elements
  wordDisplay = document.getElementById("wordDisplay");
  lettersContainer = document.getElementById("letters");
  timerElement = document.getElementById("timer");
  scoreElement = document.getElementById("score");
  msg = document.getElementById("msg");

  usedWords.clear(); // Reset used words
  score = 0;
  timeLeft = 30;

  updateScoreAndTime();
  startTimer();
  selectNewWord();
}

function scrambleWord(word) {
  return word.split("").sort(() => Math.random() - 0.5);
}

function selectNewWord() {
  msg.innerHTML = "";
  if (usedWords.size === words.length) {
    endGame("Well Done! All words completed.");
    return;
  }

  do {
    currentWord = words[Math.floor(Math.random() * words.length)];
  } while (usedWords.has(currentWord));

  usedWords.add(currentWord);
  scrambledLetters = scrambleWord(currentWord);
  selectedLetters = [];
  updateUI();
}

function updateUI() {
  wordDisplay.innerHTML = "_ ".repeat(currentWord.length).trim();
  lettersContainer.innerHTML = "";

  scrambledLetters.forEach((letter, index) => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "letter-button btn-primary";
    button.onclick = () => handleLetterClick(letter, index);
    lettersContainer.appendChild(button);
  });
}

function handleLetterClick(letter, index) {
  selectedLetters.push(letter);
  scrambledLetters[index] = "";

  updateWordDisplay();
  updateLettersUI();

  if (selectedLetters.length === currentWord.length) {
    checkWord();
  }
}

function updateWordDisplay() {
  let displayedWord = selectedLetters.join(" ");
  wordDisplay.innerHTML = displayedWord + "_ ".repeat(currentWord.length - selectedLetters.length).trim();
}

function updateLettersUI() {
  lettersContainer.innerHTML = "";
  scrambledLetters.forEach((letter, index) => {
    if (letter) {
      const button = document.createElement("button");
      button.textContent = letter;
      button.className = "letter-button btn-primary";
      button.onclick = () => handleLetterClick(letter, index);
      lettersContainer.appendChild(button);
    }
  });
}

function checkWord() {
    const guessedWord = selectedLetters.join("");
    if (guessedWord === currentWord) {
        score += 10;
        timeLeft += 5;
        selectNewWord();  // Move to a new word if correct
    } else {
        msg.innerHTML = "Wrong! Try again!";
        setTimeout(reshuffleWord, 1000);  // Reshuffle instead of skipping
    }
    updateScoreAndTime();
}

function reshuffleWord() {
    scrambledLetters = scrambleWord(currentWord);  // Reshuffle current word
    selectedLetters = [];
    msg.innerHTML = "";
    updateUI();
}

function updateScoreAndTime() {
  scoreElement.textContent = score;
  timerElement.textContent = timeLeft;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame("Time's up! Game Over.");
    }
  },
    1000);
}

function endGame(message) {
  clearInterval(timerInterval);
  gameBox.innerHTML = ""; // Clear the game box

  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  gameBox.appendChild(messageElement);

  const button = document.createElement("button");
  button.textContent = "Play Again";
  button.className = "btn btn-primary";
  button.onclick = startGame;
  gameBox.appendChild(button);
}

// Start the game when the page loads
document.addEventListener("DOMContentLoaded", startGame);