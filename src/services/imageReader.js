const textract = require('textract');

module.exports = {
  read,
};

function read(imagePath) {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(imagePath, ( error, text ) => {
      if(error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}