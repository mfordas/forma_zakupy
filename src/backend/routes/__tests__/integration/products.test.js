import * as request from 'supertest';
import * as application from '../../../app';

let api;
let server


describe('/api/products', () => {
    beforeEach(async () => {
        server = await application.main();
        api =  request.agent(server);
    });
    afterEach(() => {
        server.close()
    });

    describe('GET /', () => {
        it('should return all products', async () => {

            const res = await api.get('/api/products')
            expect(res.status).toBe(200);
        });
    });
});