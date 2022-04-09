var c = require("chalk");
var { log } = console;
var fs = require("fs");

const shell = (cmd) => {
  const spawn = require("child_process").spawnSync;
  const data = cmd.split(" ");
  const cmdName = data[0];
  const args = data.slice(1);
  const result = spawn(cmdName, args);
};

const logCmd = (cmd, run) => {
  log(`${c.green("[+]")} ${c.gray(cmd)}`);
  if (run) shell(cmd);
};
if (fs.readdirSync("./types").length === 0) {
  log(`${c.green("[!]")} ${c.gray("building creply...")}`);
  logCmd(`npx tsc -p tsconfig.json`, true);
  log(`${c.green("[!]")} ${c.gray("build finished")}`);
} else {
  log(`${c.green("[!]")} ${c.gray("creply already built")}`);
}
