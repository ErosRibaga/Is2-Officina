const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


describe('GET /api/v1/operations', () => {

    let connection;

    let operationSpy;
    let operationSpyFindById;
    let userSpy;
    let userSpyFindById;
    let carSpy;
    let carSpyFindById;


    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect('mongodb+srv://db_prova1:admin@cluster0.ijsod.mongodb.net/officina?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
        /*const Operation = require('./models/operation');
        const User = require('./models/user');
        const Car = require('./models/car');

        userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
            return [{
                id: 1001010,
                name: 'Franco',
                surname: 'Rossi',
                password: '123456',
                email: 'francorossi@mail.com',
                admin: false,
            }]
        });

        carSpy = jest.spyOn(Car, 'find').mockImplementation((criterias) => {
            return [{
                id: 1001010,
                name: 'Franco',
                surname: 'Rossi',
                password: '123456',
                email: 'francorossi@mail.com',
                admin: false,
            }]
        });

        operationSpy = jest.spyOn(Operation, 'find').mockImplementation((criterias) => {
            return [{
                id: 1010,
                title: 'Operation Testing',
                description: 'Operation Testing',
                employee: 'Employee Testing',
            }];
        });*/
    });

    afterAll(() => {
        mongoose.connection.close();
    });

    // create a valid token
    var token = jwt.sign(
        {
            email: 'pl@mail.com',
            id: '6290e320900f428a261cc754',
            admin: 'true'
        },
        'is2laboratory2017',
        { expiresIn: 86400 }
    );

    test('GET /api/v1/operations should respond with an array of operations', () => {
        return request(app)
            .get('/api/v1/operations')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                console.log("Get all the operations: ", res.body);
            });
    });

    test('GET /api/v1/operations/:id should respond with the operation with the corresponding Id', () => {
        return request(app)
            .get('/api/v1/operations/629783896e8511ac7d0e7218')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                console.log("Get operation by id (629783896e8511ac7d0e7218): ", res.body);
            });
    });

    test('POST /api/v1/operations with Title not specified', () => {
        return request(app)
            .post('/api/v1/operations')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send(
                {
                    description: 'No title operation',
                    startDate: new Date(1654156800000),
                    endDate: new Date(1654171200000),
                    employee: true,
                    car: '62977e45d6a23ec9e17fafd7'
                })
            .expect(400, { error: 'Title not specified' });
    });


});

