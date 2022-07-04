/* eslint-disable no-plusplus */
import { resolve } from 'path';

// GLOBAL VARIABLES //
let totalGames = 0;
let totalCorrect = 0;
let totalWrong = 0;

// Game Functions //

const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

export default function initGameController(db) {
  const beginGame = async (req, res) => {
    if (req.cookies.loggedIn === 'true') {
      res.sendFile(resolve('dist', 'begin.html'));
    } else {
      res.redirect('/login');
    }
  };

  const categorypick = async (req, res) => {
    try {
      const categories = await db.Category.findAll({
        attributes: ['categoryName', 'id'],
      });
      res.send(categories);
    } catch (error) {
      console.log(error);
    }
  };

  // Once category chosen, list all the words in gamestate
  const initializeGame = async (req, res) => {
    const wordArray = [];
    try {
      const date = new Date();
      const { id } = req.cookies;
      const stats = await db.Stats.findOrCreate({
        where: {
          userId: Number(id),
        },
        defaults: {
          userId: Number(id),
          gamesPlayed: 0,
          wordsCorrect: 0,
          wordsWrong: 0,
          createdAt: date,
          updatedAt: date,
        },
      });
      totalGames = stats[0].dataValues.gamesPlayed;
      totalCorrect = stats[0].dataValues.wordsCorrect;
      totalWrong = stats[0].dataValues.wordsWrong;

      const category = req.params.index;

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
      res.send({
        category,
        randomWord,
        totalGames,
        totalCorrect,
        totalWrong,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newRound = async (req, res) => {
    const wordArray = [];
    // Creating word object so the same word does not repeat itself in the game
    // const wordObject = {};
    const { id } = req.cookies;

    try {
      console.log(req.body);
      const category = req.params.index;
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
      totalGames += 1;
      if (req.body.winState === false) {
        totalWrong++;
      } else {
        totalCorrect++;
      }
      console.log({ totalGames, totalCorrect, totalWrong });
      await db.Stats.update(
        {
          userId: Number(id),
          gamesPlayed: totalGames,
          wordsCorrect: totalCorrect,
          wordsWrong: totalWrong,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          where: {
            userId: Number(id),
          },
        },
      );

      res.send({
        category,
        randomWord,
        totalGames,
        totalCorrect,
        totalWrong,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const accessStats = async (req, res) => {
    const { id } = req.cookies;

    try {
      const stats = await db.Stats.findAll({
        where: {
          userId: id,
        },
      });
      const username = await db.User.findAll({
        where: {
          id,
        },
      });
      res.send({ stats, username });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    beginGame,
    categorypick,
    initializeGame,
    newRound,
    accessStats,
  };
}
