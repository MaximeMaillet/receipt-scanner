module.exports = {
  replacePriceLetterWithNumber,
  findOperationsZone,
  findTotalZone,
  extractOperations,
  extractTotal,
  getTotalPrice,
  getTotalOperations,
};

const separationKeywords = ['libelle', 'montant'];
const regexPrice = /([0-9]*)\s*(\.|,)\s*([0-9]{2})(€)/;
const currency = {
  name: 'Euros',
  symbol: '€'
};

/**
 * Replace O (letter) with 0 (number)
 * @param text
 */
function replacePriceLetterWithNumber(text) {
  return text.replace(/([0-9]*\s*(?:\.|,))O([0-9]{1})/ig, '$10$2');
}

/**
 * Get total price
 * @param total
 * @return {*}
 */
function getTotalPrice(total) {
  for(let i in total) {
    if(total[i].label.match(/total/i)) {
      return total[i].price;
    }
  }

  return 0;
}

function getTotalOperations(operations) {
  let totalOperations = 0.;
  for(let i in operations) {
    totalOperations += parseFloat(operations[i].price);
  }

  return Math.round(totalOperations * 100) / 100;
}

/**
 * Find zone for total
 * @param text
 * @return {string}
 */
function findTotalZone(text) {
  const match = text.match(/total/i);
  const lastCurrency = text.lastIndexOf(currency.symbol) === -1 ? 1000 : text.lastIndexOf(currency.symbol);
  const nStartTotal = match['index'];
  return (text.substr(nStartTotal, lastCurrency-nStartTotal)+currency.symbol).trim();
}

/**
 * Extract total
 * @param text
 * @return {Array}
 */
function extractTotal(text) {
  const rawTotal = text.trim()
    .replace(/([0-9]*\s*(?:\.|,)\s*[0-9]{2}€\s)/g, '$1%%')
    .split('%%');

  return operationLineSplitter(rawTotal);
}

/**
 * Find limit of operations
 * @param text
 * @return {string}
 */
function findOperationsZone(text) {
  let nStarts = [], nCurrent;

  const matchFirstTotal = text.match(/€.{0,10}total/i);
  const nStartTotal = matchFirstTotal['index']+1;

  for(let i in separationKeywords) {
    if((nCurrent = text.toLowerCase().indexOf(separationKeywords[i].toLowerCase())) !== -1) {
      nStarts.push((nCurrent+separationKeywords[i].length));
    }
  }

  const nStart = Math.max(...nStarts);
  return text.substr(nStart, nStartTotal-nStart);
}

/**
 *
 * @param text
 * @return {Array}
 */
function extractOperations(text) {
  const rawOperations = text.trim().replace(/(\s[0-9]*(?:\.|,)[0-9]{2}€\s)/g, '$1%%').split('%%');
  return operationLineSplitter(rawOperations);
}

/**
 * Split array operations to object with label & price
 * @param rawOperations
 * @return {Array}
 */
function operationLineSplitter(rawOperations) {
  const operationsSplittered = [];
  for(let i in rawOperations) {
    let line = rawOperations[i].replace(regexPrice, '%%$1.$3');
    let lineSplitter = line.split('%%');
    operationsSplittered.push({
      raw: rawOperations[i],
      label: lineSplitter[0] ? lineSplitter[0].trim().toLowerCase() : '',
      price: lineSplitter[1] ? lineSplitter[1].trim() : '',
    })
  }

  return operationsSplittered;
}