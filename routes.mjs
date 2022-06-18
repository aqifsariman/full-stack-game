import db from './models/index.mjs';
import initUserController from './controllers/userAuth.mjs';

export default function bindRoutes(app) {
  const UsersController = initUserController(db);
  // main page
  app.get('/', UsersController.registration);
  app.post('/register', UsersController.createUser);
  app.get('/login', UsersController.loginPage);
  app.post('/login', UsersController.login);
}
