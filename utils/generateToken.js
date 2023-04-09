const jwtToken = require('jsonwebtoken')

const generateWebToken = (id)=>{
    return jwtToken.sign({id},process.env.JWT_KEY,{expiresIn:'30d'})
}

module.exports = generateWebToken