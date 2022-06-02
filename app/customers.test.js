const request = require('supertest');
const app = require('./app');
const Customer = require('./models/customer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

var customerSpyFindById;
var customerSpy;

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

describe('GET /api/v1/customers', () => {
  beforeAll(async () => {
    console.log(adminToken);
    connection = await mongoose.connect(
      'mongodb+srv://db_prova1:admin@cluster0.ijsod.mongodb.net/officina?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    customerSpy = jest
      .spyOn(Customer, 'find')
      .mockImplementation((criterias) => {
        return [
          {            
            id: 1010,
            name: 'Mario',
            surname: 'Draghi',
            phone: '1234567890',
          },
          {
            id: 1011,
            name: 'Dario',
            surname: 'Maghi',
            phone: '1234567891',
          },
        ];
      });
    customerSpyFindById = jest
      .spyOn(Customer, 'findById')
      .mockImplementation((id) => {
        if (id == 1010)
          return {
            id: 1010,
            name: 'Mario',
            surname: 'Draghi',
            phone: '1234567890'
          };
        else return {};
      });
  });

  afterAll(() => {
    customerSpyFindById.mockRestore();
    mongoose.connection.close();
  });

  test('GET /api/v1/customers with admin user should respond with an array of customers', async () => {
    return request(app)
      .get('/api/v1/customers')
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          self: '/api/v1/customers/1010',
          name: 'Mario',
          surname: 'Draghi',
          phone: '1234567890',
        },
        {
          self: '/api/v1/customers/1011',
          name: 'Dario',
          surname: 'Maghi',
          phone: '1234567891',
        },
      ]);
  });

  test('GET /api/v1/customers/:id with admin user should respond with an array of customers', async () => {
    return request(app)
      .get('/api/v1/customers/1010')
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, {
        self: '/api/v1/customers/1010',
        name: 'Mario',
        surname: 'Draghi',
        phone: '1234567890',
      });
  });

  test('GET /api/v1/customers with normal user should respond with status code 401', async () => {
    return request(app)
      .get('/api/v1/customers')
      .set('x-access-token', userToken)
      .expect('Content-Type', /json/)
      .expect(401, { error: 'Not allowed' });
  });
});

describe('POST /api/v1/customers', () => {
  test('POST /api/v1/customers with name not specified', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .expect(400, { error: 'Name not specified' });
  });

  test('POST /api/v1/customers with surname not specified', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name' })
      .expect(400, { error: 'Surname not specified' });
  });

  test('POST /api/v1/customers with phone not specified', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname' })
      .expect(400, { error: 'Phone not specified' });
  });
});

