import bcrypt from "bcryptjs";
import _ from "lodash";
import mongoose from 'mongoose';
import {
  validateUser
} from "../models/user.js";
import {
  validateProduct
} from "../models/product.js";
import {
  sendEmail
} from "./email.js";
import {
  auth
} from "../middleware/authorization.js";
import {
  admin
} from "../middleware/admin.js";
import {
  validateExternalUser
} from "../models/user_external_service.js";
import verify from '../../frontend/utils/googleAuth.js';
import express from "express";
import jwt from 'jsonwebtoken';
const router = express.Router();

const registerNewUser = async (req, res) => {
  const User = res.locals.models.user;
  const {
    error
  } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
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
};

router.post("/", registerNewUser );

const registerNewGoogleUser = async (req, res) => {
  const verificationResult = await verify(req.body);

  if (verificationResult instanceof Error) return res.status(401).send(console.error(verificationResult));

  let user = await res.locals.models.user.findOne({
    email: verificationResult.email
  });

  if (user) return res.status(400).send('User already registered');

  const newExternalUser = {
      name: verificationResult.name,
      email: verificationResult.email,
      external_id: verificationResult.sub,
      isVerified: true,
    };
    
    const {
      error
    } = validateExternalUser(newExternalUser);
    if (error) return res.status(400).send(error.details[0].message);
    
    const ExternalUser = res.locals.models.user;

    user = new ExternalUser(newExternalUser);

    await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
};

router.post("/googleUser", registerNewGoogleUser);

const getMyData = async (req, res) => {
  const User = res.locals.models.user;

  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
};

router.get("/me", auth, getMyData);

const verifyUser = async (req, res) => {
  const User = res.locals.models.user;

  let user = jwt.verify(req.params.token, process.env.JWTPRIVATEKEY);
  await User.findByIdAndUpdate(user._id, {
    isVerified: true
  }, {
    new: true
  });

  res.send(user);
};

router.get('/verification/:token', verifyUser);

const getUserDataById = async (req, res) => {
  const User = res.locals.models.user;


  if (mongoose.Types.ObjectId.isValid(req.params.id)) { 

  const user = await User.findById(req.params.id);
  
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name"]));

  } else {
   
    return res.status(422).send("Wrong format of id");

  }

};

router.get("/byId/:id", auth, getUserDataById);

const getUserDataByIdForAdmin = async (req, res) => {
  const User = res.locals.models.user;


  if (mongoose.Types.ObjectId.isValid(req.params.id)) { 

  const user = await User.findById(req.params.id);
  
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(_.pick(user, ["_id", "name", "email", "isAdmin", "isVerified", "shopping_lists_id", "common_shopping_lists_id", "custom_products"]));

  } else {
   
    return res.status(422).send("Wrong format of id");

  }

};

router.get("/byIdAdmin/:id", auth, admin, getUserDataByIdForAdmin);

const getUsersListForAdmin = async (req, res) => {
  const User = res.locals.models.user;

  const users = await User.find()
    .select("_id name email")
    .sort("email");

  res.send(users);
};

router.get("/", auth, admin, getUsersListForAdmin);

const checkIfEmailIsAlreadyInDatabase = async (req, res) => {
  const User = res.locals.models.user;

  const emailParameter = req.params.email;

  const users = await User.find().sort("email");

  let result = filterEmails(users, emailParameter);

  if (result.length >= 1) return res.send(true);

  if (result.length === 0) return res.send(false);
};

router.get("/:email", checkIfEmailIsAlreadyInDatabase);

const addCustomProduct = async (req, res) => {
  const User = res.locals.models.user;

  const Product = res.locals.models.product;
  const product = new Product(req.body);
  const {
    error
  } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userHandler = await User.findById(req.params.id, "custom_products", {
    lean: true
  });

  if (!userHandler)
  return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  userHandler.custom_products.push(product);

  const user = await User.findByIdAndUpdate(
    req.params.id, {
      custom_products: userHandler.custom_products
    }, {
      new: true
    }
  );
  
  res.send(user);
};

router.put("/:id/product", auth, addCustomProduct);

const removeShoppingListFromUserShoppingLists = async (req, res) => {
  const User = res.locals.models.user;

  const userHandler = await User.findById(req.params.id, "shopping_lists_id common_shopping_lists_id", {
    lean: true
  });

  if (!userHandler)
  return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  const filteredShoppingListsIds = await userHandler.shopping_lists_id.filter(
    el => el.toString() !== req.params.idSL
  );
  const filteredCommonShoppingListsIds = await userHandler.common_shopping_lists_id.filter(
    el => el.toString() !== req.params.idSL
  );

  const user = await User.findByIdAndUpdate(
    req.params.id, {
      shopping_lists_id: filteredShoppingListsIds,
      common_shopping_lists_id: filteredCommonShoppingListsIds
    }, {
      new: true
    }
  );

  res.send(user);
};

router.put("/:id/shoppingList/:idSL", auth, removeShoppingListFromUserShoppingLists);

const findUsersByName = async (req, res) => {
  const User = res.locals.models.user;

  const nameParameter = req.params.name;

  const users = await User.find().sort("name");

  const result = filterByValue(users, nameParameter);

  res.send(result);
};

router.get("/names/:name", auth, findUsersByName);

const deleteUser = async (req, res) => {
  try {
    const User = res.locals.models.user;

    User.findById(req.params.id);

    await User.deleteOne({
      _id: req.params.id
    });
  } catch {

    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  }
  res.send('Document deleted');
};

router.delete("/:id", auth, deleteUser);

const modifyUserAccount = async (req, res) => {
  const User = res.locals.models.user;

  if (mongoose.Types.ObjectId.isValid(req.params.id)) { 

    const userHandler = await User.findById(req.params.id);

  if (!userHandler)
  return res.status(404).send("The user with the given ID was not found.");

  const user = await User.findByIdAndUpdate(req.params.id, req.body , {
    new: true
  });
  
  res.send(user);

  } else {
   
    return res.status(422).send("Wrong format of id");

  }
  
};

router.put('/byId/:id', auth, admin, modifyUserAccount);

export function filterByValue(names, name) {
  if (!name) return names;
  return names.filter(o => {
    return o.name.toLowerCase().includes(name);
  });
}

export function filterEmails(emails, emailAddres) {
  if (!emailAddres) return true;
  return emails.filter(o => {
    return o.email.toLowerCase().includes(emailAddres);
  });
}

export default router;