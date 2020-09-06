import GoogleAuth from 'google-auth-library';

export default async function verify(req) {
    const client = new GoogleAuth.OAuth2Client(process.env.REACT_APP_GOOGLE_AUTH_API_CLIENTID);
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