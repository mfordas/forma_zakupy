import bcrypt from 'bcryptjs';
import _ from 'lodash';
import {validateUser} from '../models/user.js';
import {sendEmail} from './email.js';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  const User = res.locals.models.user;
  const {
    error
  } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();

  // send email 
  const url = `http://127.0.0.1:8080/api/users/confirmation/${token}`;
  sendEmail(req.body.email, url);

  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

export default router;