// Game Functions //

import { resolve } from 'path';

const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

export default function initGameController(db) {
  const beginGame = async (req, res) => {
    res.sendFile(resolve('dist', 'begin.html'));
    try {
      const categories = await db.Category.findAll({
        attributes: ['categoryName', 'id'],
      });
      res.send(categories);
    }
    catch (error) {
      console.log(error);
    }
  };
  // Once category chosen, list all the words in gamestate
  const initializeGame = async (req, res) => {
    const wordArray = [];
    // Creating word object so the same word does not repeat itself in the game
    const wordObject = {};

    try {
      const category = req.params.index;
      console.log('Category: ', category);
      const words = await db.Word.findAll({
        where: {
          categoryId: category,
        },
        attributes: ['word'],
      });
      words.forEach((word) => {
        wordArray.push(word.dataValues.word);
      });
      const randomWord = wordArray[getRandomIndex(wordArray.length)];
      console.log(randomWord);
      // Updating wordObject
      wordObject.word = randomWord;
      wordObject.count = 1;
      console.log(wordObject);
      res.send({ category, randomWord });
    }
    catch (error) {
      console.log(error);
    }
  };

  return {
    beginGame,
    initializeGame,
  };
}
