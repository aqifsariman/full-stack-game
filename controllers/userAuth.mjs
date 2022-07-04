import sequelizePackage from 'sequelize';
import { resolve } from 'path';
import jsSHA from 'jssha';

const { ValidationError, DatabaseError } = sequelizePackage;

/* eslint-disable quotes */
export default function initUserController(db) {
  const registration = (req, res) => {
    res.sendFile(resolve('dist', 'register.html'));
  };
  const loginPage = (req, res) => {
    if (req.cookies.loggedIn === 'true') {
      res.redirect('/begingame');
    }
    res.sendFile(resolve('dist', 'login.html'));
  };
  const createUser = async (req, res) => {
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(req.body.password);
    const hashedPassword = shaObj.getHash('HEX');
    try {
      const user = await db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });
      res.cookie('loggedIn', true);
      res.cookie('username', `${user.username}`);
      res.cookie('id', `${user.id}`);
      res.redirect('/login');
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error('This is a validation error!');
        console.error(error);
        console.error('The following is the first error message:');
        console.error(error.errors[0].message);
        res.send(error);
      } else if (error instanceof DatabaseError) {
        console.error('This is a database error!');
        console.error(error);
        res.send(error);
      } else {
        console.error(error);
        res.send(error);
      }
    }
  };

  const login = async (req, res) => {
    try {
      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      shaObj.update(req.body.password);
      const hashedPassword = shaObj.getHash('HEX');
      const user = await db.User.findOne({
        where: {
          username: req.body.username,
        },
      });
      if (req.cookies.loggedIn === 'true') {
        res.redirect('/begingame');
      } else if (hashedPassword === user.dataValues.password) {
        res.cookie('loggedIn', 'true');
        res.cookie('username', `${req.body.username}`);
        res.cookie('id', `${user.id}`);
        res.redirect('/begingame');
      } else {
        res.send('no match');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async (req, res) => {
    res.clearCookie('loggedIn');
    res.clearCookie('username');
    res.redirect('/login');
  };

  const profile = (req, res) => {
    res.sendFile(resolve('dist', 'user.html'));
  };
  return {
    registration,
    createUser,
    loginPage,
    login,
    logout,
    profile,
  };
}
