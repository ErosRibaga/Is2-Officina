const express = require('express');
const router = express.Router();
const User = require('./models/user');
const Operation = require('./models/operation');

/**
 * @swagger
 * /users:
 *  get:
 *    tags: [users]
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', async (req, res) => {
  let users = await User.find({});

  users = users.map((user) => {
    return {
      self: '/api/v1/users/' + user.id,
      name: user.name,
      surname: user.surname,
      password: user.password,
      email: user.email,
      admin: user.admin,
    };
  });
  res.status(200).json(users);
});

router.get('/:id', async (req, res) => {
  let user = await User.findById(req.params.id).exec();

  if (!user) {
    res.status(404).send('User not found');
    return;
  }

  res.status(200).json({
    self: '/api/v1/users/' + user.id,
    name: user.name,
    surname: user.surname,
    password: user.password,
    email: user.email,
    admin: user.admin,
  });
});

/**
 * @swagger
 * /users:
 *  post:
 *    tags: [users]
 *    description: Use to insert a new user.
 *    parameters:
 *      - in: body
 *        name: body
 *        description: The user to create
 *        schema:
 *          type: object
 *          required:
 *            - 'name'
 *            - 'surname'
 *            - 'password'
 *            - 'mail'
 *            - 'admin'
 *          properties:
 *            name:
 *              type: string
 *              description: The user's name.
 *              example: Paolo
 *            surname:
 *              type: string
 *              description: The user's surname.
 *              example: Franci
 *            password:
 *              type: string
 *              description: The user's password.
 *              example: Cav0C4r0t3!!
 *            mail:
 *              type: string
 *              description: The user's mail.
 *              example: paolo.franci@indirizzoprivato.com
 *            admin:
 *              type: boolean
 *              description: The user's role, if true, the user is an admin, otherwise he's a normal user.
 *              example: true
 *    responses:
 *      '201':
 *        description: User successfully inserted
 */

router.post('', async (req, res) => {
  let user = new User({
    name: req.body.name,
    surname: req.body.surname,
    password: req.body.password,
    email: req.body.email,
    admin: req.body.admin,
  });

  user = await user.save();

  let userId = user.id;

  res
    .location('/api/v1/users/' + userId)
    .status(201)
    .send();
});

router.put('/:id', async (req, res) => {
  let user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    surname: req.body.surname,
    password: req.body.password,
    email: req.body.email,
    admin: req.body.admin,
  });

  res
    .location('/api/v1/users/' + req.params.id)
    .status(204)
    .send();
});

router.delete('/:id', async (req, res) => {
  let user = await User.findById(req.params.id).exec();

  if (!user) {
    res.status(404).send();
    console.log('user not found');
    return;
  }

  //Cascade delete all the operations done on the car
  Operation.deleteMany({ employee: user._id }, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send('Cannot cascade delete the operation');
      return;
    }
  });

  await user.deleteOne();
  console.log('user removed');
  res.status(204).send();
});

//export the router to use it in the index.js
module.exports = router;
