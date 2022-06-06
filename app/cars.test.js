const request = require('supertest');
const app = require('./app');
const Car = require('./models/car');
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
var carId;
var customerId;

describe('GET /api/v2/cars', () => {


    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();
        app.locals.db = await mongoose.connect(mongod.getUri());

        var customer = new Customer({
            name: "testname",
            surname: "testsurname",
            phone: "123456789",
        });

        customerId = await customer.save();
        customerId = customerId._id;

        var car = new Car({
            brand: 'testbrand',
            model: 'testmodel',
            plate: 'AA000AA',
            description: 'testdescription',
            owner: customerId,
        });

        carId = await car.save();
        carId = carId._id;

    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('GET /api/v2/cars with admin user should respond with an array of users', async () => {
        return request(app)
            .get('/api/v2/cars')
            .set('x-access-token', adminToken)
            .expect('Content-Type', /json/)
            .expect(200, [
                {
                    self: '/api/v2/cars/' + carId,
                    brand: 'testbrand',
                    model: 'testmodel',
                    plate: 'AA000AA',
                    description: 'testdescription',
                    owner: {
                        _id: '' + customerId,
                        name: "testname",
                        surname: "testsurname",
                        phone: "123456789",
                        __v: 0
                    },
                },
            ]);
    });

    test('GET /api/v2/cars/:id with admin user should respond with a car', async () => {
        return request(app)
            .get('/api/v2/cars/' + carId)
            .set('x-access-token', adminToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                self: '/api/v2/car/' + carId,
                brand: 'testbrand',
                model: 'testmodel',
                plate: 'AA000AA',
                description: 'testdescription',
                owner: {
                    _id: '' + customerId,
                    name: "testname",
                    surname: "testsurname",
                    phone: "123456789",
                    __v: 0
                },
            },
            );
    });

    test('GET /api/v2/cars with normal user should respond with status code 401', async () => {
        return request(app)
            .get('/api/v2/cars')
            .set('x-access-token', userToken)
            .expect('Content-Type', /json/)
            .expect(401, { error: 'Not allowed' });
    });
});


describe('POST /api/v2/cars', () => {
    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        app.locals.db = await mongoose.connect(mongod.getUri());

        var customer = new Customer({
            name: "testname",
            surname: "testsurname",
            phone: "123456700",
        });

        customerId = await customer.save();
        customerId = customerId._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongod.stop();
    });

    test('POST /api/v2/cars with brand not specified', async () => {
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ model: 'testmodel', plate: 'AA000AA', description: 'testdescription', owner: customerId })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v2/cars with model not specified', () => {
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ brand: 'testbrand', plate: 'AA000AA', description: 'testdescription', owner: customerId })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v2/cars with plate not specified', () => {
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ brand: 'testbrand', model: 'testmodel', description: 'testdescription', owner: customerId })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });

    test('POST /api/v2/cars with plate duplicate', async () => {
        await request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .send({ brand: 'testbrand', model: 'testmodel', plate: 'AA000AA', description: 'testdescription', owner: customerId })
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ brand: 'testbrand', model: 'testmodel', plate: 'AA000AA', description: 'testdescription', owner: customerId })
            .expect(409, { error: 'Plate already exists' });
    });

    test('POST /api/v2/cars with description not specified', () => {
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ brand: 'testbrand', model: 'testmodel', plate: 'AA000CC', owner: customerId })
            .expect(400, { error: 'Some fields are empty or undefined' });
    });


    test('POST /api/v2/cars with owner not specified', () => {
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ brand: 'testbrand', model: 'testmodel', plate: 'AA000BB', description: 'testdescription' })
            .expect(400);
    });

    test('POST /api/v2/cars with valid data', () => {
        return request(app)
            .post('/api/v2/cars')
            .set('x-access-token', adminToken)
            .set('Accept', 'application/json')
            .send({ brand: 'testbrand', model: 'testmodel', plate: 'ZZ999ZZ', description: 'testdescription', owner: customerId })
            .expect(201);
    });
});
