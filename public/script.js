/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-undef */

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                   GLOBAL VARIABLES
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// MESSAGE HEADER
const message = document.createElement('h1');
message.id = 'headerTitle';
message.classList.add('headerTitle');

// START BUTTON
const startBtn = document.getElementById('start');
if (startBtn) {
  startBtn.classList.add('start-button');
}

// GAME DIV
const gameDiv = document.createElement('div');
gameDiv.id = 'main-cont';
gameDiv.classList.add('main-cont');

// ALPHABETS DIV
const alphabetHTML = document.createElement('div');
alphabetHTML.classList.add('alphabets');
alphabetHTML.classList.add('child-element');

// WORD ELEMENT
const wordHTML = document.createElement('h3');
wordHTML.id = 'word';
wordHTML.classList.add('word');
wordHTML.classList.add('child-element');

// GUESSES ELEMENT
const guessesHTML = document.createElement('h5');
guessesHTML.classList.add('guesses');
guessesHTML.classList.add('child-element');

// NEW ROUND BUTTON
const newRoundButton = document.createElement('button');
newRoundButton.id = 'newround';
newRoundButton.innerHTML = 'NEXT WORD';
newRoundButton.classList.add('game-buttons');

// SELECTING NEW CATEGORY
const newCategoryButton = document.createElement('button');
newCategoryButton.id = 'newcategory';
newCategoryButton.innerHTML = 'ANOTHER CATEGORY';
newCategoryButton.classList.add('game-buttons');

// GAME BUTTONS DIV
const gamesButtonsDiv = document.createElement('div');
gamesButtonsDiv.id = 'gamesButtonDiv';
gamesButtonsDiv.classList.add('gamesButtonDiv');
gamesButtonsDiv.classList.add('child-element');

// HANGMAN IMAGE
const crosses = document.createElement('h1');

// WIN/LOSE MESSAGE
const popUpBox = document.createElement('div');
popUpBox.classList.add('pop-up');
const popUpMessage = document.createElement('h3');
popUpMessage.id = 'pop-up-message';

// CHART CREATION
const ctx = document.getElementById('myChart');
if (ctx) {
  axios.get('/stats').then((response) => {
    const { gamesPlayed, wordsCorrect, wordsWrong } = response.data.stats[0];
    const user = response.data.username[0].username;
    const winPercentage = (wordsCorrect / gamesPlayed) * 100;
    const myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Games Played', 'Words Correct', 'Words Wrong', 'Win Percentage'],
        datasets: [
          {
            label: 'Wordplay',
            data: [gamesPlayed, wordsCorrect, wordsWrong, winPercentage],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Hello ${user.charAt(0).toUpperCase() + user.slice(1)}!`,
          },
        },
      },
    });
  });
}

let guessedWord = [];
let guesses = 0;
let wrongGuesses = 0;
let currentCategoryIndex;
let currentUser;

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                     GAME FUNCTIONS
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

const initializeGame = function (categoryResponse, categories) {
  wrongGuesses = 0;
  wordHTML.innerHTML = '';
  crosses.innerHTML = '';
  guessedWord = [];
  if (categories) {
    currentCategory = categories.id;
    document.getElementById('headerTitle').innerHTML = `${categories.categoryName}`;
  }
  // Lists down all the available categories to play in the game

  // Retrieve random word from db sent from route
  const { randomWord } = categoryResponse.data;
  const wordArray = randomWord.split('');

  // Itirate through the word array to check for any spaces
  // Non-spacing char will show as ' _ '
  for (const letter of wordArray) {
    if (letter !== ' ') {
      guessedWord.push(' _ ');
    }
    if (letter === ' ') {
      guessedWord.push(' ');
    }
  }

  // Itirate though the guessedWord array
  // if non-spacing char, html will show ' _'
  // else will show spacing in innerHTML
  for (const guessedLetter of guessedWord) {
    if (guessedLetter !== ' ') {
      wordHTML.innerHTML += guessedLetter;
    } else {
      wordHTML.innerHTML += '&nbsp&nbsp&nbsp';
    }
  }
  gameDiv.appendChild(wordHTML);
  return { randomWord, wordArray };
};

const gameWinningLogic = function (word) {
  // If no longer includes ' _ ' game won!
  if (guessedWord.includes(' _ ') === false && wrongGuesses <= 5) {
    crosses.innerHTML = '';
    return true;
  }
  if (wrongGuesses > 5) {
    crosses.innerHTML = '';
    wordHTML.innerHTML = word;
    return false;
  }
};

const generateButtons = function (randomWord, wordArray) {
  // creation of alpabet buttons element on page
  const alphabetButtons = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map((letter) => `<button class='alpha' value='${letter}'> ${letter} </button>`)
    .join('');
  alphabetHTML.innerHTML = alphabetButtons;
  gameDiv.appendChild(alphabetHTML);

  // Itirate through all alphabet buttons to create eventlistener for each button
  // Each button will run game logic
  const letters = document.querySelectorAll('.alpha');
  letters.forEach((alpha) => {
    alpha.addEventListener('click', () => {
      alpha.setAttribute('disabled', 'true');
      // Check if the clicked word is correct
      // If correct letter guessed, it will update guessedWord array
      for (let i = 0; i < wordArray.length; i++) {
        // Clear wordHTML to be updated by new guessedWord array
        wordHTML.innerHTML = '';
        if (wordArray[i] === alpha.value) {
          guessedWord[i] = alpha.value;
          crosses.innerHTML += '🟩';
          guesses++;
        }
      }
      if (guesses === 0) {
        crosses.innerHTML += '🟥';
        wrongGuesses++;
      }

      guesses = 0;
      const parentDiv = wordHTML.parentNode;
      parentDiv.insertBefore(crosses, wordHTML);
      for (const guessedLetter of guessedWord) {
        // Update html page with the chars that are correct with all chars that are not spacing char
        if (guessedLetter !== ' ') {
          wordHTML.innerHTML += guessedLetter;
        } else {
          wordHTML.innerHTML += '&nbsp&nbsp&nbsp';
        }
      }

      const winState = gameWinningLogic(randomWord);
      if (winState === true) {
        popUpMessage.innerHTML = 'Congratulations you got it right!';
        popUpBox.classList.add('correct');
        popUpBox.appendChild(popUpMessage);
        gameDiv.appendChild(popUpBox);
        setTimeout(() => {
          popUpBox.classList.remove('correct');
          popUpBox.remove();
        }, 2000);
        setTimeout(() => {
          axios
            .post(`/${currentCategoryIndex}/new-round`, { winState })
            .then((categoryResponse) => {
              guessesHTML.innerHTML = '';
              const { randomWord: randomWord2, wordArray: wordArray2 } = initializeGame(
                categoryResponse,
                null,
              );
              generateButtons(randomWord2, wordArray2);
            });
        }, 3000);
      }
      if (winState === false) {
        popUpMessage.innerHTML = 'Your answer was wrong!';
        popUpBox.classList.add('wrong');
        popUpBox.appendChild(popUpMessage);
        gameDiv.appendChild(popUpBox);
        setTimeout(() => {
          popUpBox.classList.remove('wrong');
          popUpBox.remove();
        }, 2000);
        setTimeout(() => {
          axios
            .post(`/${currentCategoryIndex}/new-round`, { winState })
            .then((categoryResponse) => {
              guessesHTML.innerHTML = '';
              const { randomWord: randomWord2, wordArray: wordArray2 } = initializeGame(
                categoryResponse,
                null,
              );
              generateButtons(randomWord2, wordArray2);
            });
        }, 3000);
      }
    });
  });
  newRoundButton.addEventListener('click', () => {
    axios.post(`/${currentCategoryIndex}/new-round`).then((categoryResponse) => {
      const { randomWord: randomWord2, wordArray: wordArray2 } = initializeGame(
        categoryResponse,
        null,
      );
      generateButtons(randomWord2, wordArray2);
    });
  });
  gamesButtonsDiv.appendChild(newRoundButton);
  gamesButtonsDiv.appendChild(newCategoryButton);
  gameDiv.appendChild(gamesButtonsDiv);
};

const startGame = function () {
  axios.get('/categories').then((response) => {
    message.innerHTML = 'Choose a category';
    gameDiv.prepend(message);
    startBtn.remove();

    document.body.appendChild(gameDiv);
    const listDiv = document.createElement('div');
    listDiv.classList.add('list-div');
    listDiv.id = 'list-div';
    response.data.forEach((categories) => {
      const list = document.createElement('ul');
      const categoryLink = document.createElement('button');
      categoryLink.classList.add('list-button');
      categoryLink.innerHTML = categories.categoryName;
      list.append(categoryLink);
      listDiv.appendChild(list);
      categoryLink.addEventListener('click', () => {
        currentCategoryName = categories.categoryName;
        currentCategoryIndex = categories.id;
        axios
          .get(`/category/${currentCategoryIndex}`, { index: currentCategoryIndex })
          .then((categoryResponse) => {
            const { randomWord, wordArray } = initializeGame(categoryResponse, categories);
            listDiv.remove();
            generateButtons(randomWord, wordArray);
          });
      });
      gameDiv.appendChild(wordHTML);
    });
    gameDiv.appendChild(listDiv);

    JsLoadingOverlay.hide();
  });
};

const newCategory = function () {
  const headerTitle = document.getElementById('headerTitle');
  headerTitle.remove();
  alphabetHTML.remove();
  gamesButtonsDiv.remove();
  crosses.remove();
  wordHTML.innerHTML = '';
  startGame();
};

startBtn.addEventListener('click', startGame);
newCategoryButton.addEventListener('click', newCategory);
