import db from './models/index.mjs';
import initUserController from './controllers/userAuth.mjs';
import initGameController from './controllers/game.mjs';

export default function bindRoutes(app) {
  const UsersController = initUserController(db);
  const GamesController = initGameController(db);
  app.get('/', UsersController.registration);
  app.post('/register', UsersController.createUser);
  app.get('/login', UsersController.loginPage);
  app.post('/login', UsersController.login);
  app.get('/begingame', GamesController.beginGame);
  app.get('/categories', GamesController.categorypick);
  app.get('/category/:index', GamesController.initializeGame);
  app.post('/:index/new-round', GamesController.newRound);
  app.get('/logout', UsersController.logout);
  app.get('/profile', UsersController.profile);
  app.get('/stats', GamesController.accessStats);
}
