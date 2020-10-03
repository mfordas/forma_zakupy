import * as request from 'supertest';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as application from '../../../app';

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
    describe('GET /', () => {
        it('should return all shoppingLists', async () => {
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

            const adminToken = await user.generateAuthToken();

            const res = await api.get('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', adminToken)
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });
    });

    describe('POST /', () => {
        it('should save valid shoppinglist in database', async () => {
            const shoppingList = {
                "name": "Lidl"
            };

            const res = await api.post('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "Lidl");
            expect(res.body).toHaveProperty("products", []);
            expect(res.body).toHaveProperty("members_id", []);
            expect(res.body).toHaveProperty("completed", false);
        });


        it('should send 400 if shoppinglist is not valid - missing all required values', async () => {
            const shoppingList = {};

            const res = await api.post('/api/shoppingLists')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(400);
        });

    });

    describe('POST /:id/shoppingList', () => {

        it('should save valid shoppinglist in database and user shoppinglists', async () => {
            const shoppingList = {
                "name": "Tesco"
            };

            User = application.models.user;
            const user = new User({
                name: "Mat",
                email: "mail@mail.com",
                password: "12345678"
            });

            await user.save();

            const res = await api.post(`/api/shoppingLists/${user._id}/shoppingList`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(200);
            expect(res.body.shopping_lists_id.length).toBe(1);
        });

        it('should send 404 if invalid id is passed', async () => {
            const shoppingList = {
                "name": "Makro"
            };

            const res = await api.post(`/api/shoppingLists/000000000000/shoppingList`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(404);
        });

        it('should send 400 if invalid shoppinglist is passed', async () => {
            const shoppingList = {

            };

            User = application.models.user;
            const user = new User({
                name: "Mat",
                email: "mail@mail.com",
                password: "12345678"
            });

            await user.save();

            const res = await api.post(`/api/shoppingLists/${user._id}/shoppingList`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(shoppingList);

            expect(res.status).toBe(400);
        });
    });

    describe('GET /:id/shoppingLists', () => {

        it('should return all shopping lists for user', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();
            const shoppingListsIds = await shoppingLists.map(shoppinglist => shoppinglist._id);

            User = application.models.user;

            const user = new User({
                name: "Jan",
                email: 'adminEmail@Mail.com',
                password: '12345679',
                shopping_lists_id: shoppingListsIds,
                common_shopping_lists_id: [],
                custom_products: [],
                isAdmin: true,
                isVerified: true
            });

            await user.save();

            const res = await api.get(`/api/shoppingLists/${user._id}/shoppingLists`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(shoppingLists.length);
        });

        it('should send 404 if invalid user id is passed', async () => {
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

            const res = await api.get(`/api/shoppingLists/000000000000/shoppingLists`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });

    });

    describe('GET /:id', () => {

        it('should return shopping list with given id', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();
            const shoppingListId = shoppingLists[0]._id;

            const res = await api.get(`/api/shoppingLists/${shoppingListId}`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("products");
            expect(res.body).toHaveProperty("members_id");
            expect(res.body).toHaveProperty("completed");
            expect(res.body).toHaveProperty("_id", `${shoppingListId}`);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {

            const res = await api.get(`/api/shoppingLists/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

    });

    describe('PUT /:id/product', () => {

        it('should add product to shopping list of given id', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                name: "Pomidor",
                amount: 10,
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(200);
            expect(res.body.products[0]).toHaveProperty("name", "Pomidor");
            expect(res.body.products[0]).toHaveProperty("amount", 10);
            expect(res.body.products[0]).toHaveProperty("unit", "kg");
            expect(res.body.products[0]).toHaveProperty("bought", false);
            expect(res.body.products[0]).toHaveProperty("_id");
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const product = {
                name: "Pomidor",
                amount: 10,
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/000000000000/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

        it('should should send 400 if product data is not complete - missing name', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                amount: 10,
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"name" is required');
        });

        it('should should send 400 if product data is not complete - missing amount', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                name: "Pomidor",
                unit: "kg",
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"amount" is required');
        });

        it('should should send 400 if product data is not complete - missing unit', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const product = {
                name: "Pomidor",
                amount: 10,
            }

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(product);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"unit" is required');
        });

    });

    describe('GET /:id/products', () => {

        it('should get list of products from list of given id', async () => {
            ShoppingList = application.models.shoppingList;

            const shoppingLists = await ShoppingList.find();

            const shoppingListId = shoppingLists[5]._id;

            const newProducts = [{
                    name: "Pomidor",
                    amount: 10,
                    unit: "kg",
                },
                {
                    name: "Banan",
                    amount: 3,
                    unit: "szt",
                },
                {
                    name: "Marchewka",
                    amount: 5,
                    unit: "kg",
                },
            ]

            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    products: newProducts
                }, {
                    new: true
                }
            );

            const res = await api.get(`/api/shoppingLists/${shoppingListId}/products`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.get(`/api/shoppingLists/000000000000/products`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

    });

    describe('GET /:id/members', () => {
        let shoppingLists;
        let shoppingListId;

        beforeEach(async () => {
            shoppingLists = await ShoppingList.find();

            shoppingListId = shoppingLists[0]._id;

            const newMembers = [
                "000000000000",
                "000000000001",
                "000000000002",
                "000000000003",

            ]

            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    members_id: newMembers
                }, {
                    new: true
                }
            );
        });

        afterEach(async () => {
            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    members_id: []
                }, {
                    new: true
                }
            );
        });


        it('should get list of members from list of given id', async () => {
            const res = await api.get(`/api/shoppingLists/${shoppingListId}/members`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(4);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.get(`/api/shoppingLists/000000000000/members`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

    });

    describe('DELETE /:id/product/:idProduct', () => {
        let shoppingLists;
        let productId;
        let shoppingListId;

        beforeEach(async () => {
            ShoppingList = application.models.shoppingList;

            shoppingLists = await ShoppingList.find();

            shoppingListId = shoppingLists[0]._id;

            const newProducts = [{
                    _id: 1,
                    name: "Pomidor",
                    amount: 10,
                    unit: "kg",
                },
                {
                    _id: 2,
                    name: "Banan",
                    amount: 3,
                    unit: "szt",
                },
                {
                    _id: 3,
                    name: "Marchewka",
                    amount: 5,
                    unit: "kg",
                },
            ]

            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    products: newProducts
                }, {
                    new: true
                }
            );

            shoppingLists = await ShoppingList.find();

            productId = shoppingLists[0].products[0]._id;
        });

        afterEach(async () => {
            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    products: []
                }, {
                    new: true
                }
            );
        });

        it('should delete product of given id from shoppinglist of given id', async () => {
            const res = await api.delete(`/api/shoppingLists/${shoppingListId}/product/${productId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(2);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.delete(`/api/shoppingLists/000000000000/product/${productId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

        it('shouldnt delete any product if wrong product id is passed', async () => {

            const res = await api.delete(`/api/shoppingLists/${shoppingListId}/product/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.products.length).toBe(3);
        });

    });

    describe('PUT /:id/product/:idProduct', () => {
        let shoppingLists;
        let productId;
        let shoppingListId;

        beforeEach(async () => {
            ShoppingList = application.models.shoppingList;

            shoppingLists = await ShoppingList.find();

            shoppingListId = shoppingLists[0]._id;

            const newProducts = [{
                _id: new mongoose.Types.ObjectId(),
                name: "Pomidor",
                amount: 10,
                unit: "kg",
                bought: false,
            }, ]

            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    products: newProducts
                }, {
                    new: true
                }
            );

            shoppingLists = await ShoppingList.find();

            productId = shoppingLists[0].products[0]._id;
        });

        afterEach(async () => {
            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    products: []
                }, {
                    new: true
                }
            );
        });

        it('should change status of product of given id to true from shoppinglist of given id', async () => {
            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product/${productId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send({
                    bought: true
                });

            expect(res.status).toBe(200);
            expect(res.body.products[0].bought).toBe(true);
        });

        it('should change status of product of given id to false from shoppinglist of given id', async () => {
            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product/${productId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send({
                    bought: false
                });

            expect(res.status).toBe(200);
            expect(res.body.products[0].bought).toBe(false);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.put(`/api/shoppingLists/000000000000/product/${productId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono produktu lub listy zakupów z takim ID.");
        });

        it('should send 200 and dont change product status if wrong product id is passed', async () => {

            const res = await api.put(`/api/shoppingLists/${shoppingListId}/product/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send({
                    bought: true
                });

            expect(res.status).toBe(200);
            expect(res.body.products[0].bought).toBe(false);
        });

    });

    describe('PUT /:id/commonShoppingList/:idUser', () => {
        let shoppingLists;
        let shoppingListId;
        let users;
        let userId;

        beforeEach(async () => {
            shoppingLists = await ShoppingList.find();
            shoppingListId = shoppingLists[0]._id;

            users = await User.find();
            userId = users[0]._id;
        });

        afterEach(async () => {
            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    members_id: []
                }, {
                    new: true
                }
            );
        });

        it('should add user of given id to shoppinglist of given id', async () => {
            const res = await api.put(`/api/shoppingLists/${shoppingListId}/commonShoppingList/${userId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);


            expect(res.status).toBe(200);
            expect(res.body.members_id.length).toBe(1);
            expect(res.body.members_id[0]).toBe(`${userId}`);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.put(`/api/shoppingLists/000000000000/commonShoppingList/${userId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

        it('should send 404 if invalid user id is passed', async () => {
            const res = await api.put(`/api/shoppingLists/${shoppingListId}/commonShoppingList/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });

    });

    describe('PUT /:id/user/:idUser', () => {
        let shoppingLists;
        let memberId;
        let shoppingListId;

        beforeEach(async () => {
            shoppingLists = await ShoppingList.find();

            shoppingListId = shoppingLists[0]._id;

            const newUsers = [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
            ]

            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    members_id: newUsers
                }, {
                    new: true
                }
            );

            shoppingLists = await ShoppingList.find();

            memberId = shoppingLists[0].members_id[0]._id;
        });

        afterEach(async () => {
            await ShoppingList.findByIdAndUpdate(
                shoppingListId, {
                    members_id: []
                }, {
                    new: true
                }
            );
        });

        it('should remove user of given id from shoppinglist of given id', async () => {
            const res = await api.put(`/api/shoppingLists/${shoppingListId}/user/${memberId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);


            expect(res.status).toBe(200);
            expect(res.body.members_id.length).toBe(2);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.put(`/api/shoppingLists/000000000000/user/${memberId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

        it('should send 200 and dont delete user if invalid user id is passed', async () => {
            const res = await api.put(`/api/shoppingLists/${shoppingListId}/user/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.members_id.length).toBe(3);
        });

    });

    describe('DELETE /:idSl', () => {
        let shoppingListId;

        beforeEach(async () => {
            const shoppingLists = await ShoppingList.find();

            shoppingListId = shoppingLists[0]._id;
        });
        it('should remove user of given id from shoppinglist of given id', async () => {
            const res = await api.delete(`/api/shoppingLists/${shoppingListId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);


            expect(res.status).toBe(200);
            expect(res.body._id).toBe(`${shoppingListId}`);
        });

        it('should send 404 if invalid shopping list id is passed', async () => {
            const res = await api.delete(`/api/shoppingLists/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono listy zakupów z takim ID.");
        });

    });

});