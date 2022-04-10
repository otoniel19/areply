import fs from "fs";
import c from "chalk";
import readline from "readline";
import { stdin, stdout } from "process";
import { log } from "console";
import events from "events";

const emiter = new events();

const prompt = async (promptName: string, historyFile: string) => {
  const historyArray = await fs.readFileSync(historyFile, "utf8").split(/r?\n/);

  var rl = await readline.createInterface({
    input: stdin,
    output: stdout,
    history: historyArray.reverse(),
    historySize: historyArray.length,
    removeHistoryDuplicates: true
  });

  return new Promise((resolve, reject) => {
    rl.question(promptName, (answer: string) => {
      fs.appendFileSync(historyFile, "\n" + answer);
      resolve(answer);
      rl.close();
    });
  });
};
export default prompt;
