const request = require('supertest');
const app = require('./app');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// create a token for an admin user
const adminToken = jwt.sign(
  {
    email: 'email',
    id: 'id',
    admin: true,
  },
  process.env.SUPER_SECRET,
  { expiresIn: 86400 }
);

// create a token for a normal user
const userToken = jwt.sign(
  {
    email: 'email',
    id: 'id',
    admin: false,
  },
  process.env.SUPER_SECRET,
  { expiresIn: 86400 }
);

var mongod;

describe('GET /api/v2/users', () => {
  var userId;

  beforeAll(async () => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    mongod = await MongoMemoryServer.create();
    app.locals.db = await mongoose.connect(mongod.getUri());

    var user = new User({
      name: 'Dario',
      surname: 'Maghi',
      email: 'dario.maghi@gmail.it',
      password: 'password',
      admin: true,
    });

    userId = await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/v2/users with admin user should respond with an array of users', async () => {
    return request(app)
      .get('/api/v2/users')
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          self: '/api/v2/users/' + userId,
          name: 'Dario',
          surname: 'Maghi',
          email: 'dario.maghi@gmail.it',
          password: 'password',
          admin: true,
        },
      ]);
  });

  test('GET /api/v2/users/:id with admin user should respond with an user', async () => {
    return request(app)
      .get('/api/v2/users/' + userId)
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, {
        self: '/api/v2/users/' + userId,
        name: 'Dario',
        surname: 'Maghi',
        email: 'dario.maghi@gmail.it',
        password: 'password',
        admin: true,
      });
  });

  test('GET /api/v2/users with normal user should respond with status code 401', async () => {
    return request(app)
      .get('/api/v2/users')
      .set('x-access-token', userToken)
      .expect('Content-Type', /json/)
      .expect(401, { error: 'Not allowed' });
  });
});

describe('POST /api/v2/users', () => {
  beforeAll(async () => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    app.locals.db = await mongoose.connect(mongod.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
  });

  test('POST /api/v2/users with name not specified', async () => {
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .expect(400, { error: 'Some fields are empty or undefined' });
  });

  test('POST /api/v2/users with surname not specified', () => {
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name' })
      .expect(400, { error: 'Some fields are empty or undefined' });
  });

  test('POST /api/v2/users with email not specified', () => {
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname' })
      .expect(400, { error: 'Some fields are empty or undefined' });
  });

  test('POST /api/v2/users with email duplicate', async () => {
    await request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .send({ name: 'name1', surname: 'surname1', email: 'name1.sur1@gmail.com', password:'password1', admin: true });
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name2', surname: 'surname2', email: 'name1.sur1@gmail.com', password:'password2', admin: false })
      .expect(409, { error: 'email already exists' });
  });

  test('POST /api/v2/users with password not specified', () => {
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname', email: 'name2.sur2@gmail.com', })
      .expect(400, { error: 'Some fields are empty or undefined' });
  });


  test('POST /api/v2/users with role not specified', () => {
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname', email: 'name3.sur3@gmail.com', password: 'password', })
      .expect(201);
  });

  test('POST /api/v2/users with valid data', () => {
    return request(app)
      .post('/api/v2/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname', email: 'name4.sur4@gmail.com', password: 'password', admin: true })
      .expect(201);
  });
});
