import jwt from "jsonwebtoken";

const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers["token"] || req.query.token;
    if (!token) {
      return res.status(401).json({
        status: 401,
        error: "Access Denied, Token is not provided"
      });
    }
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(400).json({
          status: 400,
          error: "Access Denied, The Token provided is invalid"
        });
      }
      req.decoded = decoded
      return next();
    });
  },
};

export default Auth;