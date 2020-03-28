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
    required: true,
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
    shopping_lists_id: Joi.array().items(Joi.objectId()),
    common_shopping_lists_id: Joi.array().items(Joi.objectId()),
    custom_products: Joi.array().items(Joi.object()),
    isAdmin: Joi.boolean(),
    isVerified: Joi.boolean()
  });

  return schema.validate(user);
}

const user = userSchema;

export { user, validateUser };
