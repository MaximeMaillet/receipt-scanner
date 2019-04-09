module.exports = {
  home,
};

async function home(req, res) {
  try {
    res.send('Hi !')
  } catch(e) {
    res.status(400).send(e.message);
  }
}