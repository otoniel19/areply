//@ts-nocheck
/**
 * finds a mean
 * @param {string} input
 * @param {string[]} list
 * @returns {string[]}
 */
const findMean = (input, list) => {
  /** @type {string[]} */
  var mean = [];
  list.forEach((txt, idx) => {
    var text = input.toLowerCase();
    var word = txt.toLowerCase();
    if (word.includes(text)) {
      mean.push(txt);
    } else if (text.startsWith(word[idx])) {
      mean.push(txt);
    }
  });
  return mean.filter((o) => o !== undefined);
};
class error extends Error {
  constructor(opts) {
    super(opts.message);
    this.name = "replError";
    Object.keys(opts).forEach((key) => {
      this[key] = opts[key];
    });
    throw this;
  }
}

module.exports = {
  findMean,
  error
};
