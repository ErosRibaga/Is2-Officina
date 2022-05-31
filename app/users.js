const express = require('express');
const router = express.Router();
const User = require('./models/user');

/**
 * @swagger
 * /users:
 *  get:
 *    tags: [users]
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Operation not found
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
      role: user.role,
    };
  });
  res.status(200).json(operations);
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
 *            - 'role'
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
 *            role:
 *              type: enum
 *              description: The user's role, either user or admin.
 *              example: user
 *    responses:
 *      '201':
 *        description: Operation successfully inserted
 */
 router.post('', async (req, res) => {
    let user = new User({
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      email: req.body.email,
      role: req.body.role,
    });
  
    user = await user.save();
  
    let userId = user.id;
  
    res
      .location('/api/v1/users/' + userId)
      .status(201)
      .send();
  });

//export the router to use it in the index.js
module.exports = router;
