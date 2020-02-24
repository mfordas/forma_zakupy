import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import mongoose from 'mongoose';
// Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    default: 'User',
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    trim: true,
  },
  shopping_lists_id: {
    type: [ObjectId],
    ref: 'Shopping_list',
    default: [],
  },
  common_shopping_lists_id: {
    type: [ObjectId],
    ref: 'Common_shopping_list',
    default: [],
  },
  custom_things_id: {
    type: [ObjectId],
    ref: 'Custom_things',
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    isAdmin: this.isAdmin
  }, process.env.JWTPRIVATEKEY);
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(26)
      .trim(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .trim(),
    password: Joi.string()
      .min(8)
      .max(26)
      .required()
      .trim(),
      shopping_lists_id: Joi.array().items(Joi.object()),
      common_shopping_lists_id: Joi.array().items(Joi.object()),
      custom_things_id: Joi.array().items(Joi.object()),
    character_id: Joi.object(),
    isAdmin: Joi.boolean(),
    isVerified: Joi.boolean()
  });

  return schema.validate(user);
}

const User = mongoose.model('User', userSchema);

export {User, validateUser}