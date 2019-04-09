const libPath = require('path');
const imageReader = require('../services/imageReader');
const receiptAnalyzer = require('../services/receiptAnalyzer');
const fs = require('fs');

module.exports = {
  save
};

async function save(req, res) {
  try {
    const {path, filename} = req.file;
    let text = await imageReader.read(libPath.resolve('.')+'/'+path);
    text = receiptAnalyzer.replacePriceLetterWithNumber(text);
    const totalZone = receiptAnalyzer.findTotalZone(text);
    const total = receiptAnalyzer.extractTotal(totalZone);
    const operationZone = receiptAnalyzer.findOperationsZone(text);
    const operations = receiptAnalyzer.extractOperations(operationZone);
    const results = {
      operations,
      total,
      compare: {
        total: receiptAnalyzer.getTotalPrice(total),
        operations: receiptAnalyzer.getTotalOperations(operations),
      }
    };

    fs.writeFileSync(
      libPath.resolve('.')+'/web/receipts/'+filename.replace(/\.[^/.]+$/, '')+'.json',
      JSON.stringify(results)
    );

    res.send(results);
  } catch(e) {
    console.error(e);
    res.status(400).send(e.message);
  }
}