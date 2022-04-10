"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const process_1 = require("process");
const events_1 = __importDefault(require("events"));
const emiter = new events_1.default();
const prompt = async (promptName, historyFile) => {
  if (!fs_1.default.existsSync(historyFile))
    fs_1.default.appendFileSync(historyFile, "");
  const historyArray = await fs_1.default
    .readFileSync(historyFile, "utf8")
    .split(/r?\n/);
  var rl = await readline_1.default.createInterface({
    input: process_1.stdin,
    output: process_1.stdout,
    history: historyArray.reverse(),
    historySize: historyArray.length,
    removeHistoryDuplicates: true
  });
  return new Promise((resolve, reject) => {
    rl.question(promptName, (answer) => {
      fs_1.default.appendFileSync(historyFile, "\n" + answer);
      resolve(answer);
      rl.close();
    });
  });
};
module.exports = prompt;
