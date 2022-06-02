const request = require('supertest');
const app = require('./app');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

var userSpyFindById;
var userSpy;

// create a valid for an admin user
const adminToken = jwt.sign(
  {
    email: 'email',
    id: 'id',
    admin: true,
  },
  'is2laboratory2017',
  { expiresIn: 86400 }
);

// create a valid for a normal user
const userToken = jwt.sign(
  {
    email: 'email',
    id: 'id',
    admin: false,
  },
  'is2laboratory2017',
  { expiresIn: 86400 }
);

beforeAll(async () => {
  connection = await mongoose.connect(
    'mongodb+srv://db_prova1:admin@cluster0.ijsod.mongodb.net/officina?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
    return [
      {
        id: 1010,
        name: 'Mario',
        surname: 'Draghi',
        password: 'psw',
        email: 'email',
        admin: true,
      },
      {
        id: 1011,
        name: 'Dario',
        surname: 'Maghi',
        password: 'psw',
        email: 'email',
        admin: false,
      },
    ];
  });

  userSpyFindById = jest
    .spyOn(User, 'findById')
    .mockImplementation((id, status) => {
      if (id == 1010)
        return {
          id: 1010,
          name: 'Mario',
          surname: 'Draghi',
          password: 'psw',
          email: 'email',
          admin: true,
        };
      else return {}
    });
  
});

afterAll(() => {
  userSpyFindById.mockRestore();
  mongoose.connection.close();
});

describe('GET /api/v1/users', () => {
  test('GET /api/v1/users with admin user should respond with an user', async () => {
    return request(app)
      .get('/api/v1/users')
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          self: '/api/v1/users/1010',
          name: 'Mario',
          surname: 'Draghi',
          password: 'psw',
          email: 'email',
          admin: true,
        },
        {
          self: '/api/v1/users/1011',
          name: 'Dario',
          surname: 'Maghi',
          password: 'psw',
          email: 'email',
          admin: false,
        },
      ]);
  });

  test('GET /api/v1/users with normal user should respond with status code 401', async () => {
    return request(app)
      .get('/api/v1/users')
      .set('x-access-token', userToken)
      .expect('Content-Type', /json/)
      .expect(401, { error: 'Not allowed' });
  });

  test('GET /api/v1/users/:id with admin user should respond with an array of customers', async () => {
    return request(app)
      .get('/api/v1/users/1010')
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, {
        self: '/api/v1/users/1010',
        name: 'Mario',
        surname: 'Draghi',
        password: 'psw',
        email: 'email',
        admin: true,
      });
  });
  
});

