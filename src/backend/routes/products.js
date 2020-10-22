import { validateProduct } from "../models/product.js";
import { auth } from "../middleware/authorization.js";
import express from "express";
const router = express.Router();

const addNewProduct = async (req, res) => {
  const Product = res.locals.models.product;
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product(req.body);
  await product.save();

  res.send(product);
};

router.post("/", auth, addNewProduct);

const getAllProducts = async (req, res) => {
  const Product = res.locals.models.product;
  const product = await Product.find().sort("name");
  res.send(product);
};

router.get("/", auth, getAllProducts);

const findProductsByName = async (req, res) => {
  const Product = res.locals.models.product;

  const nameParameter = req.params.name;

  const products = await Product.find().sort("name");

  const result = filterByValue(products, nameParameter);

  res.send(result);
};

router.get("/:name", auth, findProductsByName);

function filterByValue(names, name) {
  if (!name) return names;
  return names.filter(o => {
    return o.name.toLowerCase().includes(name);
  });
}

export default router;
