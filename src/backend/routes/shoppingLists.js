import _ from "lodash";
import {
  validateShoppingList
} from "../models/shoppingList.js";
import {
  validateProduct
} from "../models/product.js";
import express from "express";
import mongoose from "mongoose";
const router = express.Router();

//add new shoppingList
router.post("/", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const {
    error
  } = validateShoppingList(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shoppingList = new ShoppingList(req.body);
  await shoppingList.save();

  res.send(shoppingList);
});

//get all shoppingLists
router.get("/", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.find().sort("name");
  res.send(shoppingList);
});

//add new shoppingList only for patient
router.post("/:id/shoppingList", async (req, res) => {
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
});

router.get("/:id/shoppingLists", async (req, res) => {
  const User = res.locals.models.user;
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  const shoppingLists = _.filter(user.shopping_lists_id);

  res.send(shoppingLists);
});

router.get("/:id", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.findById(req.params.id);
  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  res.send(shoppingList);
});

//add product to shoppingList
router.put("/:id/product", async (req, res) => {
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
  shoppingListHandler.products.push(product);

  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id, {
      products: shoppingListHandler.products
    }, {
      new: true
    }
  );

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  res.send(product);
});

//delte product from shoppingList
router.delete("/:id/product/:idProduct", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;

  const shoppingListHandler = await ShoppingList.findById(
    req.params.id,
    "products", {
      lean: true
    }
  );
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

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");
  res.send(shoppingList);
});

router.get("/:id/products", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingList = await ShoppingList.findById(req.params.id);
  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  const products = _.filter(shoppingList.products);

  res.send(products);
});

router.put("/:id/product/:idProduct", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;

  const product = await ShoppingList.findByIdAndUpdate({
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

  if (!product)
    return res.status(404).send("Nie znaleziono produktu z takim ID.");

  res.send(product);
});

//add user to shoppingList
router.put("/:id/commonShoppingList/:idUser", async (req, res) => {
  const User = res.locals.models.user;
  const ShoppingList = res.locals.models.shoppingList;
  const shoppingListHandler = await ShoppingList.findById(req.params.id, "members_id", {
    lean: true
  });

  shoppingListHandler.members_id.push(req.params.idUser);
  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id, {
      members_id: shoppingListHandler.members_id
    }, {
      new: true
    }
  );
  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

  const userHandler = await User.findById(req.params.idUser, "common_shopping_lists_id", {
    lean: true
  });
  userHandler.common_shopping_lists_id.push(req.params.id);

  const user = await User.findByIdAndUpdate(
    req.params.idUser, {
      common_shopping_lists_id: userHandler.common_shopping_lists_id
    }, {
      new: true
    }
  );

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
  res.send(user);
});

//delte user from shoppingList
router.put("/:id/user/:idUser", async (req, res) => {
  const ShoppingList = res.locals.models.shoppingList;
  const User = res.locals.models.user;

  const shoppingListHandler = await ShoppingList.findById(
    req.params.id,
    "members_id", {
      lean: true
    }
  );
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

  if (!shoppingList)
    return res.status(404).send("Nie znaleziono listy zakupów z takim ID.");

    const userHandler = await User.findById(req.params.idUser, "common_shopping_lists_id", {
      lean: true
    });

    const filteredCommonShoppingLists = await userHandler.common_shopping_lists_id.filter(
      el => el._id.toString() !== req.params.id
    );
  
    const user = await User.findByIdAndUpdate(
      req.params.idUser, {
        common_shopping_lists_id: filteredCommonShoppingLists
      }, {
        new: true
      }
    );
  
    if (!user)
      return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

    res.send(user);

});

export default router;