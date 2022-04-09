const readline = require("readline");
const fs = require("fs");

const loadHistory = async (file) => {
  let rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  const history = [];
  rl.on("line", (line) => {
    history.push(line);
  });

  return new Promise((resolve, reject) => {
    rl.on("close", () => {
      resolve(history.reverse());
    });
  });
};

module.exports = async (hf, pr) => {
  const historyArray = await loadHistory(hf);
  const rlp = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    history: historyArray,
    removeHistoryDuplicates: true,
    historySize: historyArray.length
  });

  return new Promise((resolve, reject) => {
    rlp.question(pr, (answer) => {
      resolve(answer);
      fs.appendFileSync(hf, "\n" + answer);
      rlp.close();
    });
  });
};
