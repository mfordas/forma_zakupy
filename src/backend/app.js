import express from 'express';
import helmet from 'helmet';
import home from './routes/home.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import {
    load,
    register,
    connect
} from './db/index.js';
const app = express();

const main = async () => {

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(helmet());

    const connection = await connect();
    const models = load(connection);
    if (process.env.TEST_ENV || process.env.NODE_ENV) {
        // await connection.dropDatabase();
    }

    register(app, connection, models);

    app.use('/', home);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 8080;
    app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
}

main();