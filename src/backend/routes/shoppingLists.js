import _ from "lodash";
import express from "express";
import mongoose from "mongoose";

import {
  validateShoppingList
} from "../models/shoppingList.js";
import {
  validateProduct
} from "../models/product.js";
import { auth } from "../middleware/authorization.js";
import {
  admin
} from "../middleware/admin.js";

const router = express.Router();

const addNewShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const {
    error
  } = validateShoppingList(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shoppingList = new ShoppingList(req.body);
  await shoppingList.save();

  res.send(shoppingList);
};

router.post("/", auth, addNewShoppingList);

const getAllShoppingListsFromDB = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.find().sort("name");
  res.send(shoppingList);
};

router.get("/", auth, admin, getAllShoppingListsFromDB);

const addNewShoppingListForPatient = async (req, res) => {
  const User = res.locals.models.user;
  const ShoppingList = res.locals.models.shoppingList;
  let shoppingList = new ShoppingList(req.body);
  shoppingList.members_id.push(req.params.id);
  const {
    error
  } = validateShoppingList(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await shoppingList.save();

  const userHandler = await User.findById(req.params.id, "shopping_lists_id", {
    lean: true
  });
  if (!userHandler)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
    
  userHandler.shopping_lists_id.push(shoppingList._id);

  const user = await User.findByIdAndUpdate(
    req.params.id, {
      shopping_lists_id: userHandler.shopping_lists_id
    }, {
      new: true
    }
  );

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
  
  res.send(user);
};

router.post("/:id/shoppingList", auth, addNewShoppingListForPatient);

const getPatientShoppingLists = async (req, res) => {
  const User = res.locals.models.user;
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  const privateShoppingLists = _.filter(user.shopping_lists_id);
  const commonShoppingLists = _.filter(user.common_shopping_lists_id);

  const shoppingLists = privateShoppingLists.concat(commonShoppingLists);

  res.send(shoppingLists);
};

router.get("/:id/shoppingLists", auth, getPatientShoppingLists);

const getShoppingListWithGivenID = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.findById(req.params.id);
  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  res.send(shoppingList);
};

router.get("/:id", auth, getShoppingListWithGivenID);

const addProductToShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const Product = res.locals.models.product;
  const {
    error
  } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product(req.body);

  const shoppingListHandler = await ShoppingList.findById(
    req.params.id,
    "products", {
      lean: true
    }
  );
  
  if (!shoppingListHandler)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  shoppingListHandler.products.push(product);

  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id, {
      products: shoppingListHandler.products
    }, {
      new: true
    }
  );

  res.send(shoppingList);
};

router.put("/:id/product", auth, addProductToShoppingList);

const deleteProductFromShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;

  const shoppingListHandler = await ShoppingList.findById(
    req.params.id,
    "products", {
      lean: true
    }
  );

  if (!shoppingListHandler)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  const filteredProducts = await shoppingListHandler.products.filter(
    el => el._id.toString() !== req.params.idProduct
  );

  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id, {
      products: filteredProducts
    }, {
      new: true
    }
  );
  
  res.send(shoppingList);
};

router.delete("/:id/product/:idProduct", auth, deleteProductFromShoppingList);

const getProductsFromShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.findById(req.params.id);
  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  const products = _.filter(shoppingList.products);

  res.send(products);
};

router.get("/:id/products", getProductsFromShoppingList);

const getShoppingListMembers = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.findById(req.params.id);
  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  const members = _.filter(shoppingList.members_id);

  res.send(members);
};

router.get("/:id/members", auth, getShoppingListMembers);

const changeProductStatusInShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;

  const shoppingList = await ShoppingList.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      "products.$[product].bought": req.body.bought
    }
  }, {
    arrayFilters: [{
      "product._id": new mongoose.Types.ObjectId(req.params.idProduct)
    }],
    new: true
  });

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono produktu lub listy zakupów z takim ID.");

  res.send(shoppingList);
};

router.put("/:id/product/:idProduct", auth, changeProductStatusInShoppingList);

const addUserToShoppingList = async (req, res) => {
  const User = res.locals.models.user;
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingListHandler = await ShoppingList.findById(req.params.id, "members_id", {
    lean: true
  });

  if (!shoppingListHandler)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  shoppingListHandler.members_id.push(req.params.idUser);
  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id, {
      members_id: shoppingListHandler.members_id
    }, {
      new: true
    }
  );

  const userHandler = await User.findById(req.params.idUser, "common_shopping_lists_id", {
    lean: true
  });

  if (!userHandler)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  userHandler.common_shopping_lists_id.push(req.params.id);

  await User.findByIdAndUpdate(
    req.params.idUser, {
      common_shopping_lists_id: userHandler.common_shopping_lists_id
    }, {
      new: true
    }
  );

  res.send(shoppingList);
};

router.put("/:id/commonShoppingList/:idUser", auth, addUserToShoppingList);

const deleteUserFromShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;

  const shoppingListHandler = await ShoppingList.findById(
    req.params.id,
    "members_id", {
      lean: true
    }
  );

  if (!shoppingListHandler)
  return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  const filteredMembersId = await shoppingListHandler.members_id.filter(
    el => el._id.toString() !== req.params.idUser
  );

  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id, {
      members_id: filteredMembersId
    }, {
      new: true
    }
  );

    res.send(shoppingList);
};

router.put("/:id/user/:idUser", auth, deleteUserFromShoppingList);

const deleteShoppingList = async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;

  const shoppingList = await ShoppingList.findOneAndDelete(
    {_id: req.params.idSl},

  );

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");
  res.send(shoppingList);
};

router.delete("/:idSl", auth, deleteShoppingList);

export default router;