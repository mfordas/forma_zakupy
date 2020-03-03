import _ from 'lodash';
import {validateProduct} from '../models/product.js';
import express from 'express';
const router = express.Router();




//add new shoppingList
router.post('/', async (req, res) => {
    const Product = res.locals.models.product;
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let product = new Product(req.body);
    await product.save();
  
    res.send(product);
  });
  
  //get all shoppingLists
  router.get('/', async (req, res) => {
    const Product = res.locals.models.product;
    const product = await Product.find().sort('name');
    res.send(product);
  });
  
  export default router;