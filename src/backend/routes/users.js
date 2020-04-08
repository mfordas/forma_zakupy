import bcrypt from "bcryptjs";
import _ from "lodash";
import { validateUser } from "../models/user.js";
import { validateProduct } from "../models/product.js";
import { sendEmail } from "./email.js";
import { auth } from "../middleware/authorization.js";
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const User = res.locals.models.user;
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  console.log(user);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();

  // send email
  const url = `http://127.0.0.1:8080/api/users/confirmation/${token}`;
  sendEmail(req.body.email, url);

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/me", auth, async (req, res) => {
  const User = res.locals.models.user;

  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/", async (req, res) => {
  const User = res.locals.models.user;

  const users = await User.find()
    .select("_id email")
    .sort("email");

  res.send(users);
});

router.put("/:id/product", async (req, res) => {
  const User = res.locals.models.user;

  const Product = res.locals.models.product;
  const product = new Product(req.body);
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userHandler = await User.findById(req.params.id, "custom_products", {
    lean: true
  });
  userHandler.custom_products.push(product);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      custom_products: userHandler.custom_products
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
  res.send(user);
});

router.delete("/:id/shoppingList/:idSL", async (req, res) => {
  const User = res.locals.models.user;
  const ShoppingList = res.locals.models.shoppingList;

  const userHandler = await User.findById(req.params.id, "shopping_lists_id", {
    lean: true
  });
  const filteredIds = await userHandler.shopping_lists_id.filter(
    el => el.toString() !== req.params.idSL
  );

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      shopping_lists_id: filteredIds
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
  res.send(user);
  const shoppingList = await ShoppingList.findOneAndDelete({
    _id: req.params.idSL
  });

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");
});


//finding users by name
router.get("/:name", async (req, res) => {
  const User = res.locals.models.user;

  const nameParameter = req.params.name;

  const users = await User.find().sort("name");

  const result = filterByValue(users, nameParameter);

  res.send(result);
});

function filterByValue(names, name) {
  if (!name) return names;
  return names.filter(o => {
    return o.name.toLowerCase().includes(name);
  });
}
export default router;
