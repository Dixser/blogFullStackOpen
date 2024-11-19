const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  
  next()
}

const userExtractor = async (request, response, next) => {  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid'+request.token })
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
