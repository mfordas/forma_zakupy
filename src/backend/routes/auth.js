import jwt from "jsonwebtoken";
import Joi from "@hapi/joi";
import bcrypt from "bcryptjs";
import _ from "lodash";
import express from "express";
const router = express.Router();

const createUserSchema = () => {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .trim()
      .email(),
    password: Joi.string()
      .min(8)
      .max(26)
      .required()
      .trim()
  });

  return schema;
}

const validateUser = (request, schema) => {
  return schema.validate(request);
};

const checkIfUserIsInDatabase = async (res, user) => {
  const checkedUser = await res.locals.models.user.findOne({
    email: user.email
  });
  return checkedUser;
};

const validateUserPassword = async (passwordFromRequest, passwordFromDatabase) => {
  const validPassword = await bcrypt.compare(passwordFromRequest, passwordFromDatabase);
  return validPassword;
};

const createToken = (user) => {
  return jwt.sign({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin
    },
    process.env.JWTPRIVATEKEY
  );
}

const authorizeUser = async (req, res) => {
  const schema = createUserSchema();
  const {
    error,
    value
  } = validateUser(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await checkIfUserIsInDatabase(res, value);
  if (!user) return res.status(400).send("User not found.");

  const validPassword = await validateUserPassword(value.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  if (!user.isVerified) {
    return res.status(203).send("You must first confirm the registration.");
  }

  const token = createToken(user);

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
};

router.post("/", authorizeUser);

export default router;