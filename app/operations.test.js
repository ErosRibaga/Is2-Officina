const request = require('supertest');
const app = require('./app');
const Operation = require('./models/operation');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

var operationSpy;
var operationSpyFindById;

const adminToken = jwt.sign(
    {
        email: 'email',
        id: 'id',
        admin: true,
    },
    'is2laboratory2017',
    { expiresIn: 86400 }
);

const userToken = jwt.sign(
    {
        email: 'email',
        id: 'id',
        admin: false,
    },
    'is2laboratory2017',
    { expiresIn: 86400 }
);

describe('GET /api/v1/operations', () => {

    let connection;

    beforeAll(async () => {
        jest.setTimeout(30000);
        connection = await mongoose.connect('mongodb+srv://db_prova1:admin@cluster0.ijsod.mongodb.net/officina?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

        /*userSpy = jest.spyOn(User, 'findById').mockImplementation((criterias) => {
            return [{
                id: 1001010,
                name: 'Franco',
                surname: 'Rossi',
                password: '123456',
                email: 'francorossi@mail.com',
                admin: false,
            }]
        });

        customerSpy = jest.spyOn(Customer, 'findById').mockImplementation((criterias) => {
            return [{
                id: 1001015,
                name: 'Luigi',
                surname: 'Mastroianni',
                phone: '1234567890',
            }]
        });

        carSpy = jest.spyOn(Car, 'findById').mockImplementation((criterias) => {
            return [{
                id: 1001020,
                brand: 'Franco',
                model: 'Rossi',
                plate: '123456',
                description: 'francorossi@mail.com',
                owner: 1001015,
            }]
        });*/

        operationSpy = jest.spyOn(Operation, 'find')
            .mockImplementation((criterias) => {
                return [{
                    id: 10015,
                    title: 'Operation Testing 1',
                    description: 'Operation Testing 1',
                    startDate: new Date(1654131000000),
                    endDate: new Date(1654171200000),
                    employee: 'Id employee',
                    comment: 'Comment example',
                    car: 'Id car'
                },
                {
                    id: 10020,
                    title: 'Operation Testing 2',
                    description: 'Operation Testing 2',
                    startDate: new Date(1654131000000),
                    endDate: new Date(1654171200000),
                    employee: 'Id employee',
                    comment: 'Comment example',
                    car: 'Id car'
                }
                ];
            });

        operationSpyFindById = jest.spyOn(Operation, 'findById')
            .mockImplementation((id) => {
                if (id == 10015) {
                    return {
                        id: 10015,
                        title: 'Operation Testing 1',
                        description: 'Operation Testing 1',
                        startDate: new Date(1654131000000),
                        endDate: new Date(1654171200000),
                        employee: 'Id employee',
                        comment: 'Comment example',
                        car: 'Id car'
                    };
                }
                else {
                    return {};
                }
            });
    });

    afterAll(() => {
        //operationSpyFindById.mockRestore();
        mongoose.connection.close();
    });

    /*test('GET /api/v1/operations should respond with an array of operations', () => {
        return request(app)
            .get('/api/v1/operations')
            .set('x-access-token', userToken)
            .expect('Content-Type', /json/)
            .expect(200, [{
                id: 10015,
                title: 'Operation Testing 1',
                description: 'Operation Testing 1',
                startDate: new Date(1654131000000),
                endDate: new Date(1654171200000),
                employee: 'Id employee',
                comment: 'Comment example',
                car: 'Id car'
            },
            {
                id: 10020,
                title: 'Operation Testing 2',
                description: 'Operation Testing 2',
                startDate: new Date(1654171000000),
                endDate: new Date(1654171200000),
                employee: 'Id employee',
                comment: 'Comment example',
                car: 'Id car'
            }
            ]);
    });*/

    test('GET /api/v1/operations/:id should respond with the operation with the corresponding Id', () => {
        return request(app)
            .get('/api/v1/operations/10015')
            .set('x-access-token', adminToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                id: 10015,
                title: 'Operation Testing 1',
                description: 'Operation Testing 1',
                startDate: new Date(1654131000000),
                endDate: new Date(1654171200000),
                employee: 'Id employee',
                comment: 'Comment example',
                car: 'Id car'
            })
    });

    /*test('POST /api/v1/operations with Title not specified', () => {
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
    });*/


});

