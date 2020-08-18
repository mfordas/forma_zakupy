import jwt from "jsonwebtoken";
import Joi from "@hapi/joi";
import bcrypt from "bcryptjs";
import _ from "lodash";
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  function validate(req) {
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

    return schema.validate(req);
  }

  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await res.locals.models.user.findOne({ email: value.email });
  if (!user) return res.status(400).send("User not found.");

  const validPassword = await bcrypt.compare(value.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  if (!user.isVerified) {
    return res.status(203).send("You must first confirm the registration.");
  }

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin
    },
    process.env.JWTPRIVATEKEY
  );

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

export default router;
