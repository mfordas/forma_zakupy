import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import * as request from 'supertest';
import * as application from '../../../app';
let api;
let server;
const token = jwt.sign(
    {},
    process.env.JWTPRIVATEKEY
  );

describe('/api/products', () => {
    beforeEach(async () => {
        server = await application.main();
        api = request.agent(server);
    });
    afterEach(async () => {
        await server.close();
    });

    afterAll(async done => {
        await mongoose.connection.close();
        await server.close();
        done();
    });

    describe('GET /', () => {
        it('should return all products', async () => {
            const res = await api
                .get('/api/products')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(52);
        });
    });

    describe('GET /:name', () => {
        it('should return products which match name', async () => {
            const name = 'pomidor';
            const res = await api
                .get(`/api/products/${name}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty("name", "Pomidor");
            expect(res.body[0]).toHaveProperty("amount", 0);
            expect(res.body[0]).toHaveProperty("unit", "");
            expect(res.body[0]).toHaveProperty("bought", false);
        });

        it('should return empty array if none product match name', async () => {
            const name = 'bumerang';
            const res = await api
                .get(`/api/products/${name}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe('POST /', () => {
        it('should save valid product in database', async () => {
            const product = {
                "name": "Marchewka",
                "amount": 1,
                "unit": "kg"
            };

            const res = await api.post('/api/products')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "Marchewka");
            expect(res.body).toHaveProperty("amount", 1);
            expect(res.body).toHaveProperty("unit", "kg");
            expect(res.body).toHaveProperty("bought", false);
        });

        it('should send 400 if product is not valid - missing amount and unit', async () => {
            const product = {
                "name": "Marchewka"
            };

            const res = await api.post('/api/products')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
        });
        it('should send 400 if product is not valid - missing name and unit', async () => {
            const product = {
                "amount": 1
            };

            const res = await api.post('/api/products')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
        });
        it('should send 400 if product is not valid - missing name and amount', async () => {
            const product = {
                "unit": "kg"
            };

            const res = await api.post('/api/products')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
        });
        it('should send 400 if product is not valid - missing all required values', async () => {
            const product = {};

            const res = await api.post('/api/products')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
        });
    })



});