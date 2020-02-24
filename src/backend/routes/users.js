import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import {User, validateUser} from '../models/user.js';
import {sendEmail} from './email.js';
import {auth} from '../middleware/authorization.js';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  const User1 = User;
  const {
    error
  } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // console.log(req.body);
  // let user = await User.findOne({
  //   email: req.body.email
  // });
  // if (user) return res.status(400).send('User already registered.');

  let user = new User1(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();

  // // send email -----------------
  // const url = `http://127.0.0.1:8080/api/users/confirmation/${token}`;
  // sendEmail(req.body.email, url);

  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/email', async (req, res) => {
  function validate(req) {
    const schema = {
      email: Joi.string()
        .min(5)
        .max(255)
        .required()
        .email(),
      token: Joi.string()
    };
    return Joi.validate(req, schema);
  }

  const {
    error,
    value
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // // send email -----------------
  const url = `http://127.0.0.1:8080/api/users/confirmation/${req.body.token}`;
  sendEmail(req.body.email, url);

  res.send('Email sent');
});

router.get('/confirmation/:token', async (req, res) => {
  const User = res.locals.models.user;

  let user = await jwt.verify(req.params.token, process.env.JWTPRIVATEKEY);
  user = await User.findByIdAndUpdate(user._id, {
    isVerified: true
  }, {
    new: true
  });

  res.redirect('http://localhost:3000/confirmed');
});

router.get('/', async (req, res) => {
  const User = res.locals.models.user;
  const users = await User.find()
    .select('_id email')
    .sort('email');

  res.send(users);
});

router.get('/count', async (req, res) => {
  const User = res.locals.models.user;
  const usersCount = await User.find()
    .then(response => response.length);

  res.send(`${usersCount}`);
});

router.get('/me', auth, async (req, res) => {
  const User = res.locals.models.user;

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(_.pick(user, ['_id', 'name', 'email', 'character_id']));
});

router.get('/:id', async (req, res) => {
  const User = res.locals.models.user;
  let user;
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(req.params.id);
  }

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(_.pick(user, ['_id', 'email']));
});

router.put('/me/password', auth, async (req, res) => {
  const User = res.locals.models.user;
  const {
    error
  } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);

  const user = await User.findByIdAndUpdate(
    req.user._id, {
      password: newPassword
    }, {
      new: true,
    },
  );
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(_.pick(user, ['_id', 'email']));
});

router.put('/:id/password', [auth, /*admin*/], async (req, res) => {
  const User = res.locals.models.user;
  const {
    error
  } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);

  let user;
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findByIdAndUpdate(req.params.id, {
      password: newPassword
    }, {
      new: true
    });
  }

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(_.pick(user, ['_id', 'email']));
});

export default router;