import sequelizePackage from 'sequelize';
import jsSHA from 'jssha';

const { ValidationError, DatabaseError } = sequelizePackage;

/* eslint-disable quotes */
export default function initUserController(db) {
  const registration = (req, res) => {
    res.render("register");
  };
  const loginPage = (req, res) => {
    res.render("login");
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
      res.send({ user });
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error("This is a validation error!");
        console.error(error);
        console.error("The following is the first error message:");
        console.error(error.errors[0].message);
        res.send(error);
      } else if (error instanceof DatabaseError) {
        console.error("This is a database error!");
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
      const user = await db.User.findOne({
        where: {
          username: req.body.username,
        },
      });
      console.log({ user });
      res.send({ user });
    } catch (error) {
      console.log(error);
    }
  };
  return {
    registration,
    createUser,
    loginPage,
    login,
  };
}