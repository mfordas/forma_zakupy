import Joi from "@hapi/joi";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    default: "Product"
  },
  amount: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    enum: ["", "kg", "g", "l", "ml", "szt"],
    default: ""
  },
  bought: {
    type: Boolean,
    default: false
  }
});

function validateProduct(product) {
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
    amount: Joi.number()
      .min(1)
      .required(),
    unit: Joi.valid("kg", "g", "l", "ml", "szt").required(),
    bought: Joi.boolean()
  });

  return schema.validate(product);
}

const product = productSchema;

export { product, validateProduct };
