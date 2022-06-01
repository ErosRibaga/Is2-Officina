const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');


describe('GET /api/v1/operations', () => {

    let connection;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect('mongodb+srv://db_prova1:admin@cluster0.ijsod.mongodb.net/officina?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
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
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        title: "Cmabio gomme",
                        car: "62977e45d6a23ec9e17fafd7",
                        description: "acmbiamo le gomme insieme a pr",
                        employee: "62963f1ec208fff30beaf54b",
                        endDate: "2022-06-26T00:00:00.000Z",
                        self: "/api/v1/operations/629783896e8511ac7d0e7218",
                        startDate: "2022-06-23T00:00:00.000Z",
                    });
                }
            });
    });

    test('GET /api/v1/operations/:id should respond with the operation with the corresponding Id', () => {
        return request(app)
            .get('/api/v1/operations')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        title: "Cmabio gomme",
                        car: "62977e45d6a23ec9e17fafd7",
                        description: "acmbiamo le gomme insieme a pr",
                        employee: "62963f1ec208fff30beaf54b",
                        endDate: "2022-06-26T00:00:00.000Z",
                        self: "/api/v1/operations/629783896e8511ac7d0e7218",
                        startDate: "2022-06-23T00:00:00.000Z",
                    });
                }
            });
    });

});

