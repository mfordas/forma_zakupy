import home from './routes/home.js';
import express from 'express';

const main = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use('/', home);

    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 8080;
    app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
}

main();