import jwt from "jsonwebtoken";
import _ from "lodash";
import express from "express";

import verify from '../../frontend/utils/googleAuth.js'

const router = express.Router();


router.post("/", async (req, res) => {
  const verificationResult = await verify(req.body);

  if (verificationResult instanceof Error) return res.status(400).send(console.error(verificationResult));

  let user = await res.locals.models.user.findOne({
    email: verificationResult.email
  });
  let externaluser = await res.locals.models.user.findOne({
    email: verificationResult.email
  });
  if (!user && !externaluser) {
    return res.status(404).send('User not found, register first');
  };

  if (user && verificationResult.aud === process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID && verificationResult.iss === 'accounts.google.com') {

    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin
      },
      process.env.JWTPRIVATEKEY
    );

    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } else {
    res.status(401).send("Stop doing that you dumbass")
  }
});

export default router;