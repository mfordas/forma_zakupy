import GoogleAuth from 'google-auth-library';
import jwt from "jsonwebtoken";
import _ from "lodash";
import express from "express";
const router = express.Router();

const client = new GoogleAuth.OAuth2Client(process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID);

router.post("/", async (req, res) => {
  async function verify(req) {
    try {
    const ticket = await client.verifyIdToken({
      idToken: `${req.token}`,
      audience: `${process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID}`,
    })

    const payload = ticket.getPayload();
    return payload;
    } catch (error){
      return error;
    }
  }
  
  const verificationResult = await verify(req.body);

  if (verificationResult instanceof Error) return res.status(400).send(console.error(verificationResult));

  let user = await res.locals.models.user.findOne({ email: verificationResult.email });
  if (!user) return res.status(404).send("Account not found. Created new account");

  if(user && verificationResult.aud === process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID && verificationResult.iss === 'accounts.google.com' ){

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
  } else {
    res.status(401).send("Stop doing that you dumbass")
  }
});

export default router;