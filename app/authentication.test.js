const request = require('supertest');
const app = require('./app');
const Operation = require('./models/operation');
const Customer = require('./models/customer');
const User = require('./models/user');
const Car = require('./models/car');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

var mongod;
var userId;
var adminToken;

describe('POST /api/v2/authentication/login', () => {
  beforeAll(async () => {
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

    // create a token for an admin user
    adminToken = jwt.sign(
      {
        email: 'dario.maghi@gmail.it',
        id: userId,
        admin: true,
      },
      process.env.SUPER_SECRET,
      { expiresIn: 86400 }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/v2/authentication/login with valid email and password', async () => {
    return request(app)
      .post('/api/v2/authentication/login')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({
        email: 'dario.maghi@gmail.it',
        password: 'password',
      })
      .expect(200);
  });

  test('POST /api/v2/authentication/login with empty email', async () => {
    return request(app)
      .post('/api/v2/authentication/login')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({
        password: 'password',
      })
      .expect(401, {
        success: false,
        message: 'Authentication failed. Email not found.',
      });
  });

  test('POST /api/v2/authentication/login with wrong email', async () => {
    return request(app)
      .post('/api/v2/authentication/login')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({
        email: 'pier.folgarait@gmail.it',
        password: 'password',
      })
      .expect(401, {
        success: false,
        message: 'Authentication failed. Email not found.',
      });
  });

  test('POST /api/v2/authentication/login with empty password', async () => {
    return request(app)
      .post('/api/v2/authentication/login')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({
        email: 'dario.maghi@gmail.it',
      })
      .expect(401, {
        success: false,
        message: 'Authentication failed. Wrong password.',
      });
  });

  test('POST /api/v2/authentication/login with wrong password', async () => {
    return request(app)
      .post('/api/v2/authentication/login')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({
        email: 'dario.maghi@gmail.it',
        password: 'wrongPassword',
      })
      .expect(401, {
        success: false,
        message: 'Authentication failed. Wrong password.',
      });
  });
});
