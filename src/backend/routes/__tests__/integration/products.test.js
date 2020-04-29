import supertest from 'supertest';
import * as application from '../../../appStart';
const request = supertest(application.app);


// let database;

// beforeEach(() => {
//     database = application.main;
// });
// afterEach(() => {
//     database.close()
// });

// describe('/api/products', () => {


    describe('GET /', () => {
        it('should return all products', async (done) => {

            const res = await request.get('/api/products');

            expect(res.status).toBe(200);
            done();
        });
    });
// });