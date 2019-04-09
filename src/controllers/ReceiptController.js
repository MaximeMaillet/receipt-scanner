const path = require('path');
const fs = require('fs');
const zip = require('node-zip')();

module.exports = {
  get,
};

async function get(req, res) {
  try {
    const {from} = req.query;
    const imageFiles = await readDirectory(path.resolve('.')+'/web/uploads');

    for(const i in imageFiles) {
      const match = imageFiles[i].match(/.+\/[a-z]+-([0-9]+)\.[a-z]+$/);
      if(!from || (match && parseInt(match[1]) >= parseInt(from))) {
        zip.file(i+path.extname(imageFiles[i]), fs.readFileSync(imageFiles[i]));
        zip.file(i+'.json', fs.readFileSync(path.resolve('.')+'/web/receipts/receipt-'+match[1]+'.json'));
      }
    }

    const data = zip.generate({ base64:false, compression: 'DEFLATE' });
    res.setHeader('Content-Type', 'application/zip');
    res.send(new Buffer(data, 'binary'));
  } catch(e) {
    console.log(e);
    res.status(400).send({message: e.message});
  }
}

function readDirectory(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, async(err, items) => {
      if(err) {
        reject(err);
      } else {
        const texts = [];
        for (let i=0; i<items.length; i++) {
          texts.push(directory +'/'+ items[i]);
        }

        resolve(texts);
      }
    });
  });
}