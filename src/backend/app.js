import express from "express";
import helmet from "helmet";
import path from "path";

import home from "./routes/home.js";
import auth from "./routes/auth.js";
import auth_external from './routes/auth_external.js';
import users from "./routes/users.js";
import shoppingLists from "./routes/shoppingLists.js";
import products from "./routes/products.js";
import notifications from "./routes/notifications.js";
import {
  load,
  register,
  connect,
  initialize
} from "./db/index.js";


const app = express();
let dirname = path.resolve();
let models;

const dbConnection = async () => {
  const connection = await connect();
  models = load(connection);
  if (process.env.NODE_ENV === 'test') {
    await connection.dropDatabase();
    await initialize(models);
  }

  register(app, connection, models);

  return connection;
}

const main = () => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true
    })
  );
  // app.use(express.static(path.join(dirname, "build")));
  // console.log(path.join(dirname, "./build"));
  app.use(helmet());
  app.use(express.static(path.join(dirname, "/./build")));

  app.use("/", home);
  app.use("/api/users", users);
  app.use("/api/shoppingLists", shoppingLists);
  app.use("/api/products", products);
  app.use("/api/notifications", notifications);
  app.use("/api/auth", auth);
  app.use("/api/authexternal", auth_external);

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(dirname + "/./build", "index.html"));
  });

  const port = process.env.PORT || 8080;
  let server = app.listen(port, () =>
    console.log(`Listening on ${port}`)
  );

  return server
}

const startApp = async () => {
  await dbConnection();
  main();
}

if (process.env.NODE_ENV !== 'test') {
  startApp();
}

export {
  main, models, dbConnection
};