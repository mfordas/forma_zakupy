import * as request from 'supertest';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as application from '../../../app';
import {} from '../../../../frontend/utils/notification';

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

describe('/api/notifications', () => {
    let users;
    let userId;

    beforeEach(async () => {
        users = await User.find();
        userId = users[0]._id;

    });
    afterEach(async () => {
        await User.findByIdAndUpdate(
            userId, {
                notifications: []
            }, {
                new: true
            }
        );
    });

    describe('POST /', () => {
        it('should add notification', async () => {
            const notification = {
                actionCreator: "Lidl",
                action: `Lista zakupów Lidl została ukończona`,
            }

            const res = await api.post(`/api/notifications/${userId}/notification`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(notification);

            expect(res.status).toBe(200);
            expect(res.body.notifications.length).toBe(1);
        });

        it('should return 404 if invalid user id is passed', async () => {
            const notification = {
                actionCreator: "Lidl",
                action: `Lista zakupów Lidl została ukończona`,
            }

            const res = await api.post(`/api/notifications/000000000000/notification`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .send(notification);

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });
    });

    describe('GET /', () => {
        beforeAll(async () => {
            await User.findByIdAndUpdate(
                userId, {
                    notifications: [
                        {
                            _id: new mongoose.Types.ObjectId(),
                            actionCreator: "Biedronka",
                            action: `Lista zakupów Biedronka została ukończona`,
                        },
                        {
                            _id: new mongoose.Types.ObjectId(),
                            actionCreator: "Marta",
                            action: `Marta dodała Cię do listy zakupów`,
                        },
                        {
                            _id: new mongoose.Types.ObjectId(),
                            actionCreator: "Lidl",
                            action: `Lista zakupów Lidl została ukończona`,
                        },
                    ]
                }, {
                    new: true
                }
            );
        });

        afterAll(async () => {
            await User.findByIdAndUpdate(
                userId, {
                    notifications: []
                }, {
                    new: true
                }
            );
        });

        it('should get all user notifications', async () => {
            const res = await api.get(`/api/notifications/${userId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
        });

        it('should send 404 if there is no user with given id', async () => {

            const res = await api.get(`/api/notifications/000000000000`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });

    });

    describe('PUT /:id/notification/idNotification', () => {
        let notificataionId;

        beforeAll(async () => {
            await User.findByIdAndUpdate(
                userId, {
                    notifications: [
                        {
                            _id: new mongoose.Types.ObjectId(),
                            actionCreator: "Biedronka",
                            action: `Lista zakupów Biedronka została ukończona`,
                        },
                        {
                            _id: new mongoose.Types.ObjectId(),
                            actionCreator: "Marta",
                            action: `Marta dodała Cię do listy zakupów`,
                        },
                        {
                            _id: new mongoose.Types.ObjectId(),
                            actionCreator: "Lidl",
                            action: `Lista zakupów Lidl została ukończona`,
                        },
                    ]
                }, {
                    new: true
                }
            );

            users = await User.find();
            notificataionId = users[0].notifications[0]._id;

        });
        
        afterAll(async () => {
            await User.findByIdAndUpdate(
                userId, {
                    notifications: []
                }, {
                    new: true
                }
            );
        });

        it('should change status of notification if read by user', async () => {
            const res = await api.put(`/api/notifications/${userId}/notification/${notificataionId}`)
                .set('Accept', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(200);
            expect(res.body.notifications[0].readByUser).toBe(true);
        });

        it('should send 404 if invalid user id is passed', async () => {
            const res = await api.put(`/api/notifications/000000000000/notification/${notificataionId}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)

            expect(res.status).toBe(404);
            expect(res.text).toContain("Nie znaleziono użytkowanika z takim ID.");
        });
    });
});