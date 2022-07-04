module.exports = {
  async up(queryInterface) {
    const imageLinks = [
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/4.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/5.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/6.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/7.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/8.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/9.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        imageLink: 'https://www.oligalma.com/downloads/images/hangman/hangman/10.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert('images', imageLinks);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('images', null, {});
  },
};
