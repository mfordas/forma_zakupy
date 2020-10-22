import jwt from "jsonwebtoken";
import _ from "lodash";
import express from "express";

import verify from '../../frontend/utils/googleAuth.js'

const router = express.Router();

const verifyExternalUser = async (req) => {
  return await verify(req.body);
};

const checkIfUserIsInDatabase = async (res, user) => {
  const checkedUser = await res.locals.models.user.findOne({
    email: user.email
  });
  return checkedUser;
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

const authorizeExternalUser = async (req, res) => {
  const verificationResult = await verifyExternalUser(req);

  if (verificationResult instanceof Error) return res.status(400).send(console.error(verificationResult));

  const user = await checkIfUserIsInDatabase(res, verificationResult);

  if (!user) {
    return res.status(404).send('User not found, register first');
  };

  if (user && verificationResult.aud === process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID && verificationResult.iss === 'accounts.google.com') {

    const token = createToken(user);

    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } else {
    res.status(401).send("Stop doing that you dumbass")
  }
};

router.post("/", authorizeExternalUser);

export default router;