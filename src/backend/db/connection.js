import mongoose from "mongoose";

const getByMode = (prod, dev, test) => {
  if (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") {
    return prod
  } else if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    return dev
  } else {
    return test
  }
};


const config = {
  host: getByMode(process.env.DB_HOST, process.env.DB_HOST_DEV, process.env.DB_HOST_TEST),
  port: getByMode(process.env.DB_PORT, process.env.DB_PORT_DEV, process.env.DB_PORT_TEST),
  name: getByMode(process.env.DB_NAME, process.env.DB_NAME_DEV, process.env.DB_NAME_TEST),
  username: getByMode(process.env.DB_USER, process.env.DB_USER_DEV, process.env.DB_USER_TEST),
  password: getByMode(process.env.DB_PASS, process.env.DB_PASS_DEV, process.env.DB_PASS_TEST),
  protocol: getByMode(process.env.DB_PROT, process.env.DB_PROT_DEV, process.env.DB_PROT_TEST)
};

const mongoUrl = getByMode(
  `${config.protocol}://${config.username}:${config.password}@${config.host}/${config.name}`,
  `${config.protocol}://${config.host}:${config.port}/${config.name}`,
  `${config.protocol}://${config.host}:${config.port}/${config.name}`
);

const connectionOnSuccessHandler = connection => {
  console.log(`[MongoDB] Connection to ${mongoUrl} created`);
  return connection;
};

const connectionOnErrorHandler = e => {
  console.log(`[MongoDB] Connection to ${mongoUrl} failed with error: ${e}`);
  return Promise.reject(e);
};

const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

const connect = (options = defaultOptions) => {
  return mongoose
    .createConnection(`${mongoUrl}`, options)
    .then(connectionOnSuccessHandler, connectionOnErrorHandler);
};

export default connect;