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


var mongodb;
var operationId;
var operationId2;
var userId;
var userId2;
var carId;
var customerId;
var userToken;

describe('GET /api/v1/operations', () => {


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

        var user2 = new User({
            name: "user1",
            surname: "user1",
            password: "pssw",
            email: "email",
            admin: false
        });

        userId2 = await user2.save();
        userId2 = userId2._id;

        userToken = jwt.sign(
            {
                email: 'email',
                id: '' + userId2,
                admin: false,
            },
            'is2laboratory2017',
            { expiresIn: 86400 }
        );

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

        var operation2 = new Operation({
            title: 'test1',
            description: 'test1',
            startDate: new Date('1995-12-17T03:24:00'),
            endDate: new Date('1995-12-17T05:24:00'),
            employee: userId2,
            car: carId,
        });

        operationId2 = await operation2.save();
        operationId2 = operationId2._id;

    });

    afterAll(async () => {
        await mongoose.connection.close();
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
                {
                    self: '/api/v1/operations/' + operationId2,
                    title: 'test1',
                    description: 'test1',
                    employee: {
                        _id: '' + userId2,
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

    test('GET /api/v1/operations with normal user should respond with an array of operations assigned to him', async () => {
        return request(app)
            .get('/api/v1/operations')
            .set('x-access-token', userToken)
            .expect('Content-Type', /json/)
            .expect(200, [
                {
                    self: '/api/v1/operations/' + operationId2,
                    title: 'test1',
                    description: 'test1',
                    employee: {
                        _id: '' + userId2,
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
});

describe('POST /api/v1/operations', () => {
    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        app.locals.db = await mongoose.connect(mongodb.getUri());
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('POST /api/v1/operations with title not specified', async () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: 1010,
                car: 1015,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v1/operations with description not specified', () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: 1010,
                car: 1015,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v1/operations with starDate not specified', () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                endDate: new Date('1995-12-17T05:24:00'),
                employee: 1010,
                car: 1015,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v1/operations with endDate not specified', async () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                employee: 1010,
                car: 1015,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v1/operations with employee Id not specified', () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                car: 1015,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v1/operations with car Id not specified', () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: 1010,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v1/operations with correct data', () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: 1010,
                car: 1015,
            })
            .expect(201);
    });
});

describe('PUT /api/v1/operations', () => {
    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
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

        var user2 = new User({
            name: "user1",
            surname: "user1",
            password: "pssw",
            email: "email",
            admin: false
        });

        userId2 = await user2.save();
        userId2 = userId2._id;

        userToken = jwt.sign(
            {
                email: 'email',
                id: '' + userId2,
                admin: false,
            },
            'is2laboratory2017',
            { expiresIn: 86400 }
        );

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

        var operation2 = new Operation({
            title: 'test1',
            description: 'test1',
            startDate: new Date('1995-12-17T03:24:00'),
            endDate: new Date('1995-12-17T05:24:00'),
            employee: userId2,
            car: carId,
        });

        operationId2 = await operation2.save();
        operationId2 = operationId2._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongodb.stop();
    });

    test('PUT /api/v1/operations/:id with correct data', async () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: userId2,
                car: carId,
            })
            .expect(204);
    });

    test('PUT /api/v1/operations/:id with title not specified', async () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: userId2,
                car: carId,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('PUT /api/v1/operations/:id with description not specified', async () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: userId2,
                car: carId,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('PUT /api/v1/operations/:id with startDate not specified', async () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date(),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: userId2,
                car: carId,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('PUT /api/v1/operations/:id with endDate not specified', async () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date(),
                employee: userId2,
                car: carId,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('PUT /api/v1/operations/:id with employee Id not specified', async () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: undefined,
                car: carId,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('PUT /api/v1/operations/:id with car Id not specified', () => {
        return request(app)
            .put('/api/v1/operations/' + operationId)
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({
                title: "title",
                description: "description",
                startDate: new Date('1995-12-17T03:24:00'),
                endDate: new Date('1995-12-17T05:24:00'),
                employee: userId2,
                car: undefined,
            })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });
    
});