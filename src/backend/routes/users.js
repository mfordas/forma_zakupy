import bcrypt from "bcryptjs";
import _ from "lodash";
import { validateUser } from "../models/user.js";
import { validateProduct } from "../models/product.js";
import { sendEmail } from "./email.js";
import { auth } from "../middleware/authorization.js";
import express from "express";
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post("/", auth, async (req, res) => {
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
  let url;
  process.env.NODE_ENV === 'production' ? url = `${process.env.VER_LINK_PROD}/${token}` : url = `${process.env.VER_LINK_DEV}/${token}`;
  
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

router.get('/verification/:token', async (req, res) => {
  const User = res.locals.models.user;

  let user = jwt.verify(req.params.token, process.env.JWTPRIVATEKEY);
  await User.findByIdAndUpdate(user._id, {
    isVerified: true
  }, {
    new: true
  });

  res.send(user);
});

router.get("/byId/:id", auth, async (req, res) => {
  const User = res.locals.models.user;

  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/", auth, async (req, res) => {
  const User = res.locals.models.user;

  const users = await User.find()
    .select("_id email")
    .sort("email");

  res.send(users);
});

router.put("/:id/product", auth, async (req, res) => {
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

router.put("/:id/shoppingList/:idSL", auth, async (req, res) => {
  const User = res.locals.models.user;
  const ShoppingList = res.locals.models.shoppingList;

  const userHandler = await User.findById(req.params.id, "common_shopping_lists_id", {
    lean: true
  });
  const filteredIds = await userHandler.common_shopping_lists_id.filter(
    el => el.toString() !== req.params.idSL
  );

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      common_shopping_lists_id: filteredIds
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
  

  const shoppingListHandler = await ShoppingList.findById(req.params.idSL, "members_id", {
    lean: true
  });
  const filteredMembersIds = await shoppingListHandler.members_id.filter(
    el => el.toString() !== req.params.id
  );

  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.idSL,
    {
      members_id: filteredMembersIds
    },
    { new: true }
  );

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

    res.send(shoppingList);
});


//finding users by name
router.get("/:name", auth, async (req, res) => {
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
