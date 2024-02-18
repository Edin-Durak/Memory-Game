// Variables
const restartButton = document.getElementById("restartButton");
const cardsContainer = document.querySelector(".memory-game");
const cards = Array.from(document.getElementsByClassName("card"));
const startButton = document.getElementById("startButton");
let clockDisplay = document.getElementById("clock");
let yourTime = document.getElementById("your-time");
let bestTime = document.getElementById("best-time");
let clickedCards = []; // Array to store the currently clicked cards
let moves = 0; // Number of moves made
let gameCompleted = false; // Game completion status
let clockInterval; // Variable to store the clock interval
let isTimerRunning = false; // Timer running status

// JavaScript to display the welcome modal on page load
window.addEventListener("load", function () {
  const welcomeModal = document.getElementById("welcomeModal");
  const closeButton = document.querySelector("#welcomeModal .close");

  // Display the modal
  welcomeModal.style.display = "block";

  // Close the modal when the close button is clicked
  closeButton.addEventListener("click", function () {
    welcomeModal.style.display = "none";
  });

  // Close the modal when the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target === welcomeModal) {
      welcomeModal.style.display = "none";
    }
  });
});

// Function to shuffle an array
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Function to handle card click
function handleCardClick(card) {
  // Ignore clicks on already matched cards or when the game is completed
  if (card.classList.contains("matched") || gameCompleted) {
    return;
  }

  // Check if the timer is running
  if (!isTimerRunning) {
    showModal();
    return;
  }

  // Check if the clicked card is already in the clickedCards array
  if (clickedCards.includes(card)) {
    // Card is already clicked, remove the "clicked" class
    card.classList.remove("clicked");

    // Remove the card from the clickedCards array
    clickedCards = clickedCards.filter((clickedCard) => clickedCard !== card);

    return;
  }

  // Add the clicked card to the clickedCards array
  clickedCards.push(card);

  // Add the "clicked" class to the clicked card
  card.classList.add("clicked");

  // Check if there are already two clicked cards
  if (clickedCards.length === 2) {
    const [card1, card2] = clickedCards;

    // Compare the two clicked cards
    if (card1.querySelector("img").id === card2.querySelector("img").id) {
      // Cards match, add the "matched" class to both cards
      card1.classList.add("matched");
      card2.classList.add("matched");

      // Clear the clickedCards array
      clickedCards = [];
    } else {
      // Cards do not match, remove the "clicked" class from all non-matching cards without the "matched" class
      setTimeout(() => {
        clickedCards.forEach((clickedCard) => {
          if (!clickedCard.classList.contains("matched")) {
            clickedCard.classList.remove("clicked");
          }
        });

        // Clear the clickedCards array
        clickedCards = [];
      }, 1000);
    }
  }

  // Check if all cards have the "matched" class
  const allCardsMatched =
    document.querySelectorAll(".card:not(.matched)").length === 0;
  if (allCardsMatched) {
    gameCompleted = true;
    // Game is over, perform necessary actions
    showGameWonModal(clockDisplay.textContent);
  }
}

function showModal() {
  const modal = document.getElementById("popupModal");
  modal.style.display = "block";

  // Close the modal when the user clicks on the close button or outside the modal
  const closeButton = document.querySelector("#popupModal .close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Function to show the game won modal
function showGameWonModal(time) {
  // Stop the clock
  stopClock();

  const modal = document.getElementById("gameWonModal");
  const modalClockDisplay = document.getElementById("modalClockDisplay");

  // Display the time on the modal
  modalClockDisplay.textContent = time;

  // Show the modal
  modal.style.display = "block";

  // Update your-time and best-time
  const currentTime = timeToSeconds(time);
  const yourTimeSeconds = timeToSeconds(yourTime.textContent);
  const bestTimeSeconds = timeToSeconds(bestTime.textContent);

  if (bestTimeSeconds === 0 || currentTime < bestTimeSeconds) {
    yourTime.textContent = time;
    bestTime.textContent = time;
  } else {
    yourTime.textContent = time;
  }

  // Close the modal when the user clicks on the close button
  const closeButton = document.querySelector("#gameWonModal .close");
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Add event listener for play again button
  const playAgainButton = document.getElementById("playAgainButton");
  playAgainButton.addEventListener("click", function () {
    modal.style.display = "none";
    restartGame(); // You need to define this function to restart the game
  });

  // Close the modal when the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

// Function to convert time string (MM:SS) to seconds
function timeToSeconds(time) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

// Card click event handler
function cardClickHandler() {
  handleCardClick(this);
}

// Add click event handler to each card
cards.forEach((card) => {
  card.addEventListener("click", cardClickHandler);
});

// Shuffle the cards when the page loads
window.addEventListener("DOMContentLoaded", function () {
  shuffle(cards);
  cards.forEach((card) => {
    cardsContainer.appendChild(card);
  });
});

// Function to start the clock
function startClock(display) {
  clockInterval = setInterval(function () {
    let time = display.textContent.split(":");
    let minutes = parseInt(time[0]);
    let seconds = parseInt(time[1]);

    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = formattedMinutes + ":" + formattedSeconds;
  }, 1000);
}

// Function to stop the clock
function stopClock() {
  clearInterval(clockInterval);
  isTimerRunning = false; // Set timer stopped state
}

// Start/stop button click event handler
startButton.addEventListener("click", function () {
  if (!isTimerRunning) {
    startClock(clockDisplay);
    startButton.textContent = "Stop"; // Change button text to "Stop"
    isTimerRunning = true; // Set timer running state
  } else {
    stopClock();
    startButton.textContent = "Start"; // Change button text to "Start"
    isTimerRunning = false; // Set timer stopped state
  }
});

// Restart button click event handler
restartButton.addEventListener("click", function () {
  stopClock(); // Stop the clock
  startButton.textContent = "Start"; // Change start button text to "Start"
  clockDisplay.textContent = "00:00"; // Reset the clock display

  // Reset game-specific variables
  clickedCards = [];
  moves = 0;
  gameCompleted = false;

  // Reset card classes
  cards.forEach((card) => {
    card.classList.remove("clicked", "matched");
  });

  // Shuffle the cards
  shuffle(cards);

  // Append the shuffled cards back to the container
  cards.forEach((card) => {
    cardsContainer.appendChild(card);
  });
});
