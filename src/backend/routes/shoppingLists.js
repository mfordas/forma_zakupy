import _ from 'lodash';
import {validateShoppingList} from '../models/shoppingList.js';
import express from 'express';
const router = express.Router();




//add new shoppingList
router.post('/', async (req, res) => {
    const ShoppingList = res.locals.models.shoppingList;
    const { error } = validateShoppingList(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let shoppingList = new ShoppingList(req.body);
    await shoppingList.save();
  
    res.send(shoppingList);
  });
  
  //get all shoppingLists
  router.get('/', async (req, res) => {
    const ShoppingList = res.locals.models.shoppingList;
    const shoppingList = await ShoppingList.find().sort('name');
    res.send(shoppingList);
  });

  router.post('/:id/shoppingList', async (req, res) => {
    const User = res.locals.models.user;

    const ShoppingList = res.locals.models.shoppingList;
    const { error } = validateShoppingList(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let shoppingList = new ShoppingList(req.body);
    shoppingList.members_id.push(req.params.id);

    await shoppingList.save();

    const userHandler = await User.findById(req.params.id, 'shopping_lists_id', { lean: true });
    userHandler.shopping_lists_id.push(shoppingList._id);
  
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        shopping_lists_id: userHandler.shopping_lists_id,
      },
      { new: true },
    );
  
    if (!user) return res.status(404).send('Nie znaleziono użytkowanika z takim ID.');
    res.send(user);
  });

  router.get('/:id/shoppingLists', async (req, res) => {
    const User = res.locals.models.user;
    const user = await User.findById(req.params.id);
  
    if (!user) return res.status(404).send('Nie znaleziono użytkowanika z takim ID.');
  
    const shoppingLists = _.filter(user.shopping_lists_id);
  
    res.send(shoppingLists);
  });


  router.get('/:id', async (req, res) => {
    const ShoppingList = res.locals.models.shoppingList;
    const shoppingList = await ShoppingList.findById(req.params.id);
  
    if (!shoppingList) return res.status(404).send('Nie znaleziono listy zakupów z takim ID.');
  
    res.send(shoppingList);
  });

  
  export default router;