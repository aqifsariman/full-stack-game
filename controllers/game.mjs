export default function initGameController(db) {
  const initializeGame = async (req, res) => {
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
  return {
    initializeGame,
  };
}
