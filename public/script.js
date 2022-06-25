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
const startBtn = document.getElementById('start');
const gameDiv = document.createElement('div');
gameDiv.id = 'main-cont';
const alphabetHTML = document.createElement('div');
alphabetHTML.classList.add('alphabets');
const wordHTML = document.createElement('h3');
wordHTML.classList.add('word');
const guessesHTML = document.createElement('h5');
guessesHTML.classList.add('guesses');
const guessedWord = [];
let guesses = 0;
let wrongGuesses = 0;
let currentCategory;

// TODO create new route for new game of the same category
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
  console.log(categoryResponse);
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
    }
    else {
      wordHTML.innerHTML += '&nbsp&nbsp&nbsp';
    }
  }
  gameDiv.appendChild(wordHTML);
  console.log(wordArray);
  return { randomWord, wordArray };
};

const gameWinningLogic = function (word) {
  // If no longer includes ' _ ' game won!
  if (guessedWord.includes(' _ ') === false && wrongGuesses <= 6) {
    alert("You've won!");

    return true;
  }
  if (wrongGuesses > 6) {
    console.log('You lose!');
    newGame = true;
    alert(`The correct word is ${word}.`);
  }
  return false;
};

const generateButtons = function (randomWord, wordArray) {
  const newRoundButton = document.createElement('button');
  newRoundButton.id = 'newround';
  newRoundButton.innerHTML = 'START NEW ROUND';
  // TODO Alphabet Function
  // creation of alpabet buttons element on page
  const alphabetButtons = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => `<button class='alpha' value='${letter}'> ${letter} </button>`).join('');
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
          guesses++;
        }
      }
      if (guesses === 0) {
        wrongGuesses++;
      }
      guesses = 0;

      guessesHTML.innerHTML = `Number of wrong guesses: ${wrongGuesses}`;
      gameDiv.appendChild(guessesHTML);
      for (const guessedLetter of guessedWord) {
        // Update html page with the chars that are correct with all chars that are not spacing char
        if (guessedLetter !== ' ') {
          wordHTML.innerHTML += guessedLetter;
        }
        else {
          wordHTML.innerHTML += '&nbsp&nbsp&nbsp';
        }
      }
      const winState = gameWinningLogic(randomWord);
      if (winState === true) {
        axios
          .get(`/category/${currentCategory}}`)
          .then((categoryResponse) => {
            const { randomWord: randomWord2, wordArray: wordArray2 } = initializeGame(categoryResponse, categories);
            listDiv.remove();
            generateButtons(randomWord2, wordArray2);
          });
      }
    });
  });
  gameDiv.appendChild(newRoundButton);
  newRoundButton.addEventListener('click', () => {
    axios
      .get(`/category/${currentCategory}}`)
      .then((categoryResponse) => {
        const letters = document.querySelectorAll('.alpha');

        const { randomWord: randomWord2, wordArray: wordArray2 } = initializeGame(categoryResponse, categories);
        listDiv.remove();
        generateButtons(randomWord2, wordArray2);
      }); });
};

const startGame = function () {
  axios
    .get('/categories')
    .then((response) => {
      const message = document.createElement('h2');
      message.id = 'headerTitle';
      message.classList.add('headerTitle');
      message.innerHTML = 'Choose a category';
      document.body.appendChild(message);
      startBtn.remove();

      document.body.appendChild(gameDiv);
      const listDiv = document.createElement('div');
      listDiv.classList.add('list-div');
      listDiv.id = 'list-div';
      response.data.forEach((categories) => {
        const list = document.createElement('li');
        const categoryLink = document.createElement('button');
        categoryLink.innerHTML = categories.categoryName;
        list.append(categoryLink);
        listDiv.appendChild(list);
        categoryLink.addEventListener('click', () => {
          axios
            .get(`/category/${categories.id}`, { index: categories.id })
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

startBtn.addEventListener('click', startGame);
