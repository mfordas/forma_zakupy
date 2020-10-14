import * as request from 'supertest';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
    sendEmail
} from "../../email";
import * as application from '../../../app';
jest.mock("../../email");

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
});

afterAll(() => {
    dbCon.close();
    server.close();
});

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

    describe('GET /byId/:id', () => {
        it('should pick user by id', async () => {
            User = application.models.user;

            const users = await User.find();

            const user = users[0];

            const res = await api.get(`/api/users/byId/${user._id}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id", `${user._id}`);
            expect(res.body).toHaveProperty("name", user.name);
        });

        it('should return 404 if user with given id is not found', async () => {
            const res = await api.get(`/api/users/byId/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("The user with the given ID was not found.");
        });

        it('should return 422 if user with given id is not found', async () => {
            const res = await api.get(`/api/users/byId/abcd`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(422);
            expect(res.text).toContain("Wrong format of id");
        });
    });

    describe('GET all users /', () => {
        let adminToken
        beforeAll(async () => {
            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: 'adminEmail@Mail.com',
                password: '12345679',
                shopping_lists_id: [],
                common_shopping_lists_id: [],
                custom_products: [],
                isAdmin: true,
                isVerified: true
            });

            await user.save();

            adminToken = await user.generateAuthToken();
        });

        it('should get list of all users', async () => {

            const res = await api.get(`/api/users/`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', adminToken);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(7);
        });

        it('should return 401 if user which request for userslist is not an admin', async () => {
            const res = await api.get(`/api/users/`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')

            expect(res.status).toBe(401);
        });
    });

    describe('GET /:email', () => {
        it('should return true if email is already in database', async () => {
            const users = await User.find();

            const user = users[0];

            const res = await api.get(`/api/users/${user.email}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')

            expect(res.status).toBe(200);
            expect(res.body).toBe(true);
        });

        it('should return false if email is not in database', async () => {
            const res = await api.get(`/api/users/aaa`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')

            expect(res.status).toBe(200);
            expect(res.body).toBe(false);
        });
    });

    describe('PUT /:id/product', () => {
        let user;
        let product;
        beforeAll(async () => {
            const users = await User.find();

            user = users[0];

            product = {
                "name": "Marchewka",
                "amount": 1,
                "unit": "kg"
            };
        })

        it('should add new custom product to user custom products', async () => {
            const res = await api.put(`/api/users/${user.id}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(200);
            expect(res.body.custom_products[0]).toHaveProperty("name", "Marchewka");
            expect(res.body.custom_products[0]).toHaveProperty("amount", 1);
            expect(res.body.custom_products[0]).toHaveProperty("unit", "kg");
            expect(res.body.custom_products[0]).toHaveProperty("_id");
        });

        it('should return 404 if user is not in database', async () => {
            const res = await api.put(`/api/users/000000000000/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });

        it('should return 400 if product is not valid', async () => {
            const invalidProduct = {
                "amount": 1,
                "unit": "kg"
            };

            const res = await api.put(`/api/users/${user.id}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(invalidProduct);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"name" is required');
        });
    });

    describe('PUT /:id/shoppingList/:idSL', () => {
        let user;
        let product;
        let shoppingList1Id;
        let shoppingList2Id;
        let shoppingLists;

        beforeAll(async () => {
            const users = await User.find();

            user = users[1];

            shoppingLists = await ShoppingList.find();
            shoppingList1Id = shoppingLists[0]._id;
            shoppingList2Id = shoppingLists[1]._id;

            await User.findByIdAndUpdate(
                user._id, {
                    shopping_lists_id: [shoppingList1Id, shoppingList2Id],
                    common_shopping_lists_id: [shoppingList1Id]
                }, {
                    new: true
                }
            );
        })

        it('should add new custom product to user custom products', async () => {
            const res = await api.put(`/api/users/${user.id}/shoppingList/${shoppingList1Id}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(200);
            expect(res.body.shopping_lists_id.length).toBe(1);
            expect(res.body.common_shopping_lists_id.length).toBe(0);
        });

        it('should return 404 if user is not in database', async () => {
            const res = await api.put(`/api/users/000000000000/shoppingList/${shoppingList1Id}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });

    });

    describe('GET /names/:name', () => {
        it('should get list of all users', async () => {
            const userName = 'User1'

            const res = await api.get(`/api/users/names/${userName.toLowerCase()}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty("name", userName);
        });

        it('should return 401 if user is not in database', async () => {
            const res = await api.get(`/api/users/names/xyz`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')

            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /:id', () => {
        it('should delete with given id', async () => {
            User = application.models.user;

            const users = await User.find();

            const user = users[2];

            const res = await api.delete(`/api/users/${user._id}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.text).toContain("Document deleted");
        });

        it('should return 404 if user with given id is not found', async () => {
            const res = await api.delete(`/api/users/00000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });
    });

    describe('PUT /byId/:id', () => {
        const dataToChange = {
            isAdmin: true,
            isVerified: true,
        };

        let adminToken
        beforeAll(async () => {
            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: 'adminEmail@Mail.com',
                password: '12345679',
                shopping_lists_id: [],
                common_shopping_lists_id: [],
                custom_products: [],
                isAdmin: true,
                isVerified: true
            });

            await user.save();

            adminToken = await user.generateAuthToken();
        });
        it('should change data of user with given id', async () => {
            User = application.models.user;

            const users = await User.find();

            const user = users[2];

            const res = await api.put(`/api/users/byId/${user._id}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', adminToken)
                .send(dataToChange);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("isAdmin", true);
            expect(res.body).toHaveProperty("isVerified", true);
        });

        it('should return 404 if user with given id is not found', async () => {
            const res = await api.put(`/api/users/byId/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', adminToken);

            expect(res.status).toBe(404);
            expect(res.text).toContain("The user with the given ID was not found.");
        });

        it('should return 422 if id is wrong', async () => {
            const res = await api.put(`/api/users/byId/abcd`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', adminToken);

            expect(res.status).toBe(422);
            expect(res.text).toContain("Wrong format of id");
        });

        it('should return 403 if not authorized', async () => {
            const res = await api.put(`/api/users/byId/abcd`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(403);
        });
    });
});