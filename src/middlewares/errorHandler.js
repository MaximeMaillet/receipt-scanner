module.exports = {
  routeErrors
};

function routeErrors(err, req, res, next) {
  console.log(err);
  res.send({message: err.message});
}