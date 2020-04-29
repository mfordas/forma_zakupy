import {
    load,
    register,
    connect,
    initialize
  } from "./db/index.js";

const dbConnect = async (app) => {
  const connection = await connect();
  const models = load(connection);
  if (process.env.NODE_ENV ==='test') {
    await connection.dropDatabase();
    await initialize(models);
  }

  register(app, connection, models);
}

export {dbConnect}