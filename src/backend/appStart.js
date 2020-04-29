import express from "express";

import helmet from "helmet";
import path from "path";
import home from "./routes/home.js";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import shoppingLists from "./routes/shoppingLists.js";
import products from "./routes/products.js";

const app = express();
let dirname = path.resolve();

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
  app.use("/api/auth", auth);

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(dirname + "/./build", "index.html"));
  });

  

export {
  app
};