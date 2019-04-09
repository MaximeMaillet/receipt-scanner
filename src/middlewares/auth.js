require('dotenv').config();

module.exports = {
  basicAuth,
};

function basicAuth(req, res, next) {
  const auth = {
    login: process.env.AUTH_BASIC_USERNAME,
    password: process.env.AUTH_BASIC_PASSWORD
  };

  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

  if (!login || !password || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message
    return
  }

  next()
}
