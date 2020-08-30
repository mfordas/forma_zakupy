import jwt from "jsonwebtoken";
import Joi from "@hapi/joi";
import JoiObjectId from "joi-objectid";
import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
Joi.objectId = JoiObjectId(Joi);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    default: "User"
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    trim: true
  },
  shopping_lists_id: {
    type: [ObjectId],
    ref: "ShoppingList",
    default: []
  },
  common_shopping_lists_id: {
    type: [ObjectId],
    ref: "CommonShoppingList",
    default: []
  },
  custom_products: {
    type: [Object],
    ref: "Products",
    default: []
  },
  notifications: {
    type: [Object],
    ref: "Notifications",
    default: []
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin
    },
    process.env.JWTPRIVATEKEY
  );
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(26)
      .trim()
      .required()
      .messages({
        "string.empty": "Please type your name",
        "string.min": "Name should have at least 3 characters",
        "string.max": "Name should have maximum 26 characters"
      }),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .trim()
      .required()
      .messages({
        "string.empty": "Please type your e-mail",
        "string.min": "E-mail should have at least 5 characters",
        "string.max": "E-mail should have maximum 255 characters",
        "string.email": "E-mail should have following format: id@domain"
      }),
    password: Joi.string()
      .min(8)
      .max(1024)
      .trim()
      .messages({
        "string.empty": "Please type your password",
        "string.min": "Password should have at least 8 characters",
        "string.max": "Password should have maximum 1024 characters"
      }),
    shopping_lists_id: Joi.array().items(Joi.objectId()),
    common_shopping_lists_id: Joi.array().items(Joi.objectId()),
    custom_products: Joi.array().items(Joi.object()),
    notifications: Joi.array().items(Joi.object()),
    isAdmin: Joi.boolean(),
    isVerified: Joi.boolean()
  }).options({
    abortEarly: false
  });

  return schema.validate(user);
}

const user = userSchema;

export { user, validateUser };
