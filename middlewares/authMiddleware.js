const jwt = require('jsonwebtoken')
console.log('Middleware')


const authenticateToken = (req, res, next) => {
 
    let jwtToken;
    console.log(req.headers)
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    console.log('Hello')
    console.log(jwtToken)
    if (jwtToken === undefined) {
        res.status(401);
        res.send("Invalid JWT Token");
    } else {
        console.log(jwtToken)
        console.log(process.env.JWT_KEY)
        // console.log(payload)
      const jwtVerification = jwt.verify(jwtToken, process.env.JWT_KEY,
      async (error,payload) => {
        if (error) {
            res.status(401);
            res.send("Invalid JWT Token");
        } else {
           
          next();
        }
      });
    }
  };

  module.exports = authenticateToken