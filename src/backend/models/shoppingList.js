import Joi from "@hapi/joi";
import mongoose from "mongoose";
import JoiObjectId from "joi-objectid";
const ObjectId = mongoose.Schema.Types.ObjectId;
Joi.objectId = JoiObjectId(Joi);

const shoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    default: "Lista zakupow"
  },
  products: {
    type: [Object],
    ref: "Shopping_list",
    default: []
  },
  members_id: {
    type: [ObjectId],
    ref: "Users",
    default: []
  },
  completed: {
    type: Boolean,
    default: false
  }
});

function validateShoppingList(shoppingList) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(26)
      .trim()
      .required()
      .messages({
        "string.empty": "Please type name of list",
        "string.min": "List name should have at least 3 characters",
        "string.max": "List name should have maximum 26 characters"
      }),
    products: Joi.array().items(Joi.object()),
    members_id: Joi.array().items(Joi.objectId()),
    completed: Joi.boolean()
  });

  return schema.validate(shoppingList);
}

const shoppingList = shoppingListSchema;

export { shoppingList, validateShoppingList };
