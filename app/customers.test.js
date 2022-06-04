const request = require('supertest');
const app = require('./app');
const Customer = require('./models/customer');
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
  'is2laboratory2017',
  { expiresIn: 86400 }
);

// create a token for a normal user
const userToken = jwt.sign(
  {
    email: 'email',
    id: 'id',
    admin: false,
  },
  'is2laboratory2017',
  { expiresIn: 86400 }
);

var mongod;

describe('GET /api/v1/customers', () => {
  var customerId;

  beforeAll(async () => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    mongod = await MongoMemoryServer.create();
    app.locals.db = await mongoose.connect(mongod.getUri());

    var customer = new Customer({
      name: 'Dario',
      surname: 'Maghi',
      phone: '1234567899',
    });

    customerId = await customer.save();
    customerId = customerId._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/v1/customers with admin user should respond with an array of customers', async () => {
    return request(app)
      .get('/api/v1/customers')
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          self: '/api/v1/customers/' + customerId,
          name: 'Dario',
          surname: 'Maghi',
          phone: '1234567899',
        },
      ]);
  });

  test('GET /api/v1/customers/:id with admin user should respond with an array of customers', async () => {
    return request(app)
      .get('/api/v1/customers/' + customerId)
      .set('x-access-token', adminToken)
      .expect('Content-Type', /json/)
      .expect(200, {
        self: '/api/v1/customers/' + customerId,
        name: 'Dario',
        surname: 'Maghi',
        phone: '1234567899',
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
  beforeAll(async () => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    app.locals.db = await mongoose.connect(mongod.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
  });

  test('POST /api/v1/customers with name not specified', async () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .expect(400, { error: 'Some fields are empty or undefined' });
  });

  test('POST /api/v1/customers with surname not specified', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name' })
      .expect(400, { error: 'Some fields are empty or undefined' });
  });

  test('POST /api/v1/customers with phone not specified', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname' })
      .expect(400, { error: 'Some fields are empty or undefined' });
  });

  test('POST /api/v1/customers with phone duplicate', async () => {
    await request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .send({ name: 'name1', surname: 'surname1', phone: '1234567890' });
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name2', surname: 'surname2', phone: '1234567890' })
      .expect(409, { error: 'Phone already exists' });
  });

  test('POST /api/v1/customers with non admin user', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', userToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname', phone: '1324567899' })
      .expect(401, { error: 'Not allowed' });
  });

  test('POST /api/v1/customers with valid data', () => {
    return request(app)
      .post('/api/v1/customers')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send({ name: 'name', surname: 'surname', phone: '1324567899' })
      .expect(201);
  });
});
