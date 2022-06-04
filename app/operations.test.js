const request = require('supertest');
const app = require('./app');
const Operation = require('./models/operation');
const Customer = require('./models/customer');
const User = require('./models/user');
const Car = require('./models/car');
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

var mongodb;

describe('GET /api/v1/operations', () => {
    var operationId;
    var userId;
    var carId;
    var customerId;

    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongodb = await MongoMemoryServer.create();
        app.locals.db = await mongoose.connect(mongodb.getUri());


        var user = new User({
            name: "user1",
            surname: "user1",
            password: "pssw",
            email: "email",
            admin: false
        });

        userId = await user.save();
        userId = userId._id;
        console.log("UserID: " + userId);

        var customer = new Customer({
            name: "customer1",
            surname: "customer1",
            phone: "123456789",
        });

        customerId = await customer.save();
        customerId = customerId._id;

        var car = new Car({
            brand: "brand",
            model: "model",
            plate: "AA000AA",
            description: "testdescription",
            owner: customerId
        });

        carId = await car.save();
        carId = carId._id;


        var operation = new Operation({
            title: 'test1',
            description: 'test1',
            startDate: new Date('1995-12-17T03:24:00'),
            endDate: new Date('1995-12-17T05:24:00'),
            employee: userId,
            car: carId,
        });

        operationId = await operation.save();
        operationId = operationId._id;

    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongodb.stop();
    });

    test('GET /api/v1/operations with admin user should respond with an array of operations', async () => {
        return request(app)
            .get('/api/v1/operations')
            .set('x-access-token', adminToken)
            .expect('Content-Type', /json/)
            .expect(200, [
                {
                    self: '/api/v1/operations/' + operationId,
                    title: 'test1',
                    description: 'test1',
                    employee: {
                        _id: '' + userId,
                        name: "user1",
                        surname: "user1",
                        password: "pssw",
                        email: "email",
                        admin: false,
                        __v: 0
                    },
                    startDate: '1995-12-17T02:24:00.000Z',
                    endDate: '1995-12-17T04:24:00.000Z',
                    car: {
                        _id: '' + carId,
                        brand: "brand",
                        model: "model",
                        plate: "AA000AA",
                        description: "testdescription",
                        owner: '' + customerId,
                        __v: 0
                    },
                },
            ]);
    });

    test('GET /api/v1/operations/:id with admin user should respond with a json file of the single operation', async () => {
        return request(app)
            .get('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                self: '/api/v1/operations/' + operationId,
                title: 'test1',
                description: 'test1',
                employee: {
                    _id: '' + userId,
                    name: "user1",
                    surname: "user1",
                    password: "pssw",
                    email: "email",
                    admin: false,
                    __v: 0
                },
                startDate: '1995-12-17T02:24:00.000Z',
                    endDate: '1995-12-17T04:24:00.000Z',
                    car: {
                        _id: '' + carId,
                        brand: "brand",
                        model: "model",
                        plate: "AA000AA",
                        description: "testdescription",
                        owner: '' + customerId,
                        __v: 0
                    },
            });
    });

    test('GET /api/v1/operations with normal user should respond with status code 401', async () => {
        return request(app)
            .get('/api/v1/operations')
            .set('x-access-token', userToken)
            .expect('Content-Type', /json/)
            .expect(401, { error: 'Not allowed' });
    });
});
/*
describe('POST /api/v1/customers', () => {
    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        app.locals.db = await mongoose.connect(mongodb.getUri());
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongodb.stop();
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
            .expect(409, { error: 'Phone duplicate' });
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

*/