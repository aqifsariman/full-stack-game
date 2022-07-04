// module.exports = {
//   async up(queryInterface) {
//     const categoriesList = [
//       {
//         categoryName: 'Avengers',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Batman',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Brooklyn Nine-Nine',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Game of Thrones',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Harry Potter',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'How I Met Your Mother',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Peaky Blinders',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Star Wars',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Stranger Things',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         categoryName: 'Transformers',
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     ];
//     await queryInterface.bulkInsert('categories', categoriesList, { returning: true });
//   },

//   async down(queryInterface) {
//     await queryInterface.bulkDelete('categories', null, {});
//   },
// };
