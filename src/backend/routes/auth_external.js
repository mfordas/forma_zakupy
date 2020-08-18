import GoogleAuth from 'google-auth-library';
import jwt from "jsonwebtoken";
import _ from "lodash";
import express from "express";

import {
  validateExternalUser
} from "../models/user_external_service.js";
const router = express.Router();


router.post("/", async (req, res) => {
  const client = new GoogleAuth.OAuth2Client(process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID);
  async function verify(req) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: `${req.token}`,
        audience: `${process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID}`,
      })

      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      return error;
    }
  }

  const verificationResult = await verify(req.body);

  if (verificationResult instanceof Error) return res.status(400).send(console.error(verificationResult));

  let user = await res.locals.models.user.findOne({
    email: verificationResult.email
  });
  let externaluser = await res.locals.models.user.findOne({
    email: verificationResult.email
  });
  if (!user && !externaluser) {
    const newExternalUser = {
      name: verificationResult.name,
      email: verificationResult.email,
      external_id: verificationResult.sub,
      isVerified: true,
    };
    
    const {
      error
    } = validateExternalUser(newExternalUser);
    if (error) return res.status(400).send(error.details[0].message);
    
    const ExternalUser = res.locals.models.user;

    user = new ExternalUser(newExternalUser);

    await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
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