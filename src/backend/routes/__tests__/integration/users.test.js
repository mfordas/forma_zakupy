import * as request from 'supertest';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as application from '../../../app';
jest.mock("../../email");
import {
    sendEmail
  } from "../../email";

let api;
let server;
let dbCon;
let ShoppingList;
let User;

const token = jwt.sign({},
    process.env.JWTPRIVATEKEY
);

beforeAll(async () => {
    
    dbCon = await application.dbConnection();
    server = application.main();
    api = request.agent(server);
    const newShoppingLists = [{
            name: "Lidl"
        },
        {
            name: "Castorama"
        },
        {
            name: "Biedronka"
        }
    ];
    ShoppingList = application.models.shoppingList;
    const collectionShoppingList = ShoppingList.collection;
    await collectionShoppingList.insertMany(newShoppingLists);

    const newUsers = [{
            name: "User1",
            email: "user1@email.com",
            password: "123456789",
        },
        {
            name: "User2",
            email: "user1@email.com",
            password: "123456789",
        },
        {
            name: "User3",
            email: "user1@email.com",
            password: "123456789",
        },
    ];

    User = application.models.user;
    const collectionUser = User.collection;
    await collectionUser.insertMany(newUsers);

    

})

afterAll(() => {
    dbCon.close();
    server.close();
})

describe('/api/shoppingLists', () => {
    describe('POST /', () => {
        it('should save valid user in database', async () => {
            const newUser = {
                name: "User12",
                email: "user12@fordas.pl",
                password: "123456789",
            }

            const res = await api.post('/api/users')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "User12");
            expect(res.body).toHaveProperty("email", "user12@fordas.pl");
            expect(res.body).toHaveProperty("_id");
            expect(sendEmail).toHaveBeenCalled()
        });


        it('should send 400 if user is not valid - missing all required values', async () => {
            const newUser = {};

            const res = await api.post('/api/users')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(res.status).toBe(400);
        });

        it('should send 400 if user is not valid - missing name', async () => {
            const newUser = {
                email: "user12@fordas.pl",
                password: "123456789",
            };

            const res = await api.post('/api/users')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(res.status).toBe(400);
        });

        it('should send 400 if user is not valid - missing email', async () => {
            const newUser = {
                name: "User12",
                password: "123456789",
            };

            const res = await api.post('/api/users')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(res.status).toBe(400);
        });

        it('should send 400 if user is not valid - missing password', async () => {
            const newUser = {
                name: "User12",
                email: "user12@fordas.pl",
            };

            const res = await api.post('/api/users')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(res.status).toBe(400);
        });

        it('should send 400 if user is not valid - user already registered', async () => {
            const newUser = {
                name: "User1",
                email: "user1@email.com",
                password: "123456789",
            };

            const res = await api.post('/api/users')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(newUser);

            expect(res.status).toBe(400);
            expect(res.text).toContain("User already registered.");
        });

    });

    describe('GET /verification/:token', () => {
        it('should verify user account', async () => {
            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: "adminEmail@fordas.pl",
                password: '12345679',
            });

            await user.save();

            const token = user.generateAuthToken();

            const res = await api.get(`/api/users/verification/${token}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
        });
    });


});