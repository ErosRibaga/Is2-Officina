const express = require('express');
const router = express.Router();
const User = require('./models/user');
const Operation = require('./models/operation');
const Car = require('./models/car');
const { isAdmin } = require('./permissions');

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
router.get('/', isAdmin(true), async (req, res) => {
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


/**
 * @swagger
 * /users/{id}:
 *  get:
 *    tags: [users]
 *    description: Use to get an user by its id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The user's id
 *        type: string
 *    responses:
 *      '200':
 *        description: User successfully retrieved
 *      '404':
 *        description: User not found
 */
router.get('/:id', isAdmin(true), async (req, res) => {
  let user = await User.findById(req.params.id);

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

//get all the cars of an user
router.get('/:id/operations', isAdmin(true), async (req, res) => {
  try {
    const operations = await Operation.find({ employee: req.params.id });
    return res.status(200).json(operations);
  } catch (err) {
    console.log(err);
    return res.status(404).send({ message: 'Customer not found' });
  }
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
 *              example: PasswordSuperSegreta
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
 *      '400':
 *        description: Email already exists
 *      '409':
 *        description: Some fields are empty or undefined
 */

router.post('', isAdmin(true), async (req, res) => {
  let user = new User({
    name: req.body.name,
    surname: req.body.surname,
    password: req.body.password,
    email: req.body.email,
    admin: req.body.admin,
  });

  try {
    await user.save();

    res
      .location('/api/v1/users/' + user.id)
      .status(201)
      .send();
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'email already exists' });
    }
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    tags: [users]
 *    description: Use to update an user.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The user's id
 *        type: string
 *      - in: body
 *        name: body
 *        description: The user to update
 *        schema:
 *          type: object
 *          required:
 *            - 'name'
 *            - 'surname'
 *            - 'password'
 *            - 'email'
 *            - 'admin'
 *          properties:
 *            name:
 *              type: string
 *              description: The user's name.
 *              example: Paolo
 *            surname:
 *              type: string
 *              description: The user's surname.
 *              example: Franceschi
 *            password:
 *              type: string
 *              description: The user's password.
 *              example: PasswordSuperSegreta
 *            email:
 *              type: string
 *              description: The user's email.
 *              example: paolofranceschi@email.com
 *            admin:
 *              type: boolean
 *              description: If true the user is an admin, if false, the user is not.
 *              example: true
 *    responses:
 *      '204':
 *        description: User successfully updated
 *      '400':
 *        description: Some fields are empty or undefined
 *      '409':
 *        description: Email already exists
 *      '404':
 *        description: User not found
 */
router.put('/:id', isAdmin(true), async (req, res) => {
  let user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    surname: req.body.surname,
    password: req.body.password,
    email: req.body.email,
    admin: req.body.admin,
  });

  try {
    await user.save();

    res
      .location('/api/v1/users/' + user.id)
      .status(201)
      .send();
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'email already exists' });
    }
    return res
      .status(400)
      .json({ error: 'Some fields are empty or undefined' });
  }

});


/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    tags: [users]
 *    description: Use to delete an user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The user's id
 *        type: string
 *    responses:
 *      '204':
 *        description: User successfully removed
 *      '403':
 *        description: Cannot delete the user, it has some operations associated to it
 *      '404':
 *        description: User not found
 */
router.delete('/:id', isAdmin(true), async (req, res) => {
  let user = await User.findById(req.params.id).exec();

  if (!user) {
    res.status(404).send();
    console.log('user not found');
    return;
  }

  //Check if the user is associated with any operations, in that case it cannot be deleted
  let operations = await Operation.find({ employee: user._id });

  if (operations.length != 0) {
    res.status(403).send();
    console.log(
      'Cannot delete the user, it has some operations associated to it'
    );
    return;
  }

  await user.deleteOne();
  console.log('user removed');
  res.status(204).send();
});

//export the router to use it in the index.js
module.exports = router;
