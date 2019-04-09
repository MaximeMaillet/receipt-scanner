module.exports = {
  save
};

async function save(req, res) {
  try {
    res.send();
  } catch(e) {
    res.status(400).send();
  }
}