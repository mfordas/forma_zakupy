import * as request from 'supertest';
import bcrypt from "bcryptjs";
import * as application from '../../../app';

let api;
let server;
let dbCon;
let User;
let user;

beforeAll(async () => {
    dbCon = await application.dbConnection();
    server = application.main();
    api = request.agent(server);
    User = application.models.user;

    user = new User({
        name: "Jan",
        email: 'email@mail.com',
        password: '123456789',
        isAdmin: false,
        isVerified: true
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
})

afterAll(() => {
    dbCon.close();
    server.close();
})

describe('/api/auth', () => {
    describe('POST /', () => {
        it('should return valid login data', async () => {
            const loginData = {
                "email": 'email@mail.com',
                "password": '123456789'
            }

            const res = await api.post('/api/auth')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(loginData)

            expect(res.body).toMatchObject({
                name: "Jan",
                email: 'email@mail.com',
            });
        });

        it('should return 400 if login is wrong', async () => {
            const loginData = {
                "email": 'email@mail.com',
                "password": '12345678'
            }

            const res = await api.post('/api/auth')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(loginData)

            expect(res.status).toBe(400);
            expect(res.text).toContain('Invalid email or password.');
        });

        it('should return 400 if email is wrong', async () => {
            const loginData = {
                "email": 'email1@mail.com',
                "password": '123456789'
            }

            const res = await api.post('/api/auth')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.text).toContain('User not found.');
        });

        it('should return 400 and error if email is missing', async () => {
            const loginData = {

            }

            const res = await api.post('/api/auth')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"email" is required');
        });

        it('should return 400 and error if email is missing', async () => {
            const loginData = {
                "email": 'email@mail.com'
            }

            const res = await api.post('/api/auth')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.text).toContain('"password" is required');
        });

        it('should return 203 user is not verified', async () => {
            await User.findByIdAndUpdate(user._id, {
                isVerified: false
              }, {
                new: true
              });

            const loginData = {
                "email": 'email@mail.com',
                "password": '123456789'
            }

            const res = await api.post('/api/auth')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(loginData);

            expect(res.status).toBe(203);
            expect(res.text).toContain("You must first confirm the registration.");
        });

    })

});