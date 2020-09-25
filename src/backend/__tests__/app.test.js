import * as application from '../app';

describe('Testing main connection to DB and server', () => {
    it('Should return valid server from main function', () => {
        const referenceServer = {
            allowHalfOpen: true,
            pauseOnConnect: false,
            httpAllowHalfOpen: false,
            timeout: 120000,
            keepAliveTimeout: 5000,
            maxHeadersCount: null,
            headersTimeout: 40000,
            _connectionKey: '6::::8080',
        }
        const returnedServer = application.main();

        expect(returnedServer).toMatchObject(referenceServer);

        returnedServer.close();
        
     });

    it('Should create valid connection to DB', async () => {
        const referenceConnection = {
            _connectionString: 'mongodb://localhost:27017/formaZakupyDB_TEST',
            _connectionOptions: {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              driverInfo: { name: 'Mongoose', version: '5.10.0' }
            },
            name: 'formaZakupyDB_TEST',
            host: 'localhost',
            port: 27017,
        }
        const returnedConnection = await application.dbConnection();

        expect(returnedConnection).toMatchObject(referenceConnection);

        returnedConnection.close();
        
     });

});