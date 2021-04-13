const jwt = require('jsonwebtoken');
const config = require('../../config');


module.exports = (req, res, next) => {

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, config.auth.JWT_SECRET, (err, decoded) => {
    if(err) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    } else {
      //userData is set if data of requesting user might be needed later when
      //request is handled
      req.userData = decoded;
      next();
    }
  });
}
