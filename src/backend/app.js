import express from 'express';
import helmet from 'helmet';
import path from 'path';
import mongoose from 'mongoose';
import home from './routes/home.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
const app = express();

const main = async () => {

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(helmet());

    mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected'))
    .catch(err => console.log("Error"))

    app.use('/', home);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(express.static(path.join('../frontend/build')));

    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 8080;
    app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
}

main();