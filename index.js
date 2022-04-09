const prompt = require("./prompt");
const { stdin } = require("process");
const readline = require("readline");
const c = require("chalk");
const { log } = console;

readline.emitKeypressEvents(stdin);
if (stdin.isTTY) stdin.setRawMode(true);

const events = require("events");

class creply extends events {
  /**
   * @param {string} historyFile the file to save the history
   * @param {string} replName the name of the repl
   * @param {string} commandsPrefix the prefix of repl commands
   * @param {string} version the version of the repl
   * @param {string} originalName the original name of the repl
   * @param {string} description the description of the repl
   * @param {boolean} showHelpOnStart if true show help for commands on start
   */
  constructor(
    historyFile,
    replName,
    commandsPrefix,
    version,
    originalName,
    description,
    showHelpOnStart
  ) {
    super();
    this.historyFile = historyFile;
    this.name = replName;
    this.prefix = commandsPrefix;
    this.version = version;
    this.originalName = originalName;
    this.description = description;
    /** @type {any[]} */
    this.commands = [];
    showHelpOnStart
      ? log(
          c.gray(
            `welcome to ${c.blue(this.originalName)} ${c.green(
              this.version
            )}\ntype ${c.green(this.prefix)}${c.green("help")} to view help`
          )
        )
      : null;
  }
  async start() {
    while (true) {
      stdin.on("keypress", (ch, key) =>
        this.emit("keypress", { ch: ch, key: key })
      );
      const question = await prompt(this.historyFile, this.name);
      this.emit("input", question);
      if (question.startsWith(this.prefix)) {
        this.eval(question);
      }
    }
  }
  /**
   * the creply eval used by the repl
   * @param {string} args the repl arguments
   * @returns {void}
   */
  eval(args) {
    args = args.replace(this.prefix, "");
    const command = args.split(" ")[0];
    const commandArgs = args.split(" ").slice(1).join(" ").trim();
    if (command == "help") this.help();
    else if (command == "close") this.close();
    else if (command == "clear")
      process.stdout.write("\x1B[2J\x1B[3J\x1B[H\x1Bc");
    else {
      const cmd = this.commands.find((key) => key.name == command);
      if (cmd) cmd.fn(commandArgs);
      else {
        log(`${c.red("command not found:")} ${c.gray(command)}`);
      }
    }
  }
  /**
   * close the repl
   */
  close() {
    process.exit(1);
  }
  /**
   * add a command to the repl
   * @param {string} name the command name
   * @param {function} fn the function to execute when command is called
   * @param {string} description the description of the command
   */
  addCommand(name, description, fn) {
    this.commands.push({
      name: name.replaceAll(" ", "-").trim(),
      desc: description,
      fn: fn
    });
  }
  /**
   * outputs help
   */
  help() {
    log(`${c.gray("name:")} ${c.blue(this.originalName)}`);
    log(`${c.gray("description:")} ${c.blue(this.description)}`);
    log(`${c.gray("version:")} ${c.blue(this.version)}`);
    log(`${c.gray("prefix:")} ${c.blue(this.prefix)}`);
    log(`${c.gray("commands:")}`);
    this.commands.length !== 0
      ? this.commands.forEach((key) => {
          log(` ${c.green(key.name)} ${c.grey(key.desc)}`);
        })
      : log(` ${c.red("no commands")}`);

    log(`${c.gray("system commands:")}`);
    log(` ${c.green("close")} ${c.grey("close the repl")}`);
    log(` ${c.green("help")} ${c.grey("show this help")}`);
    log(` ${c.green("clear")} ${c.gray("clear the repl")}`);
  }
  /**
   * chalk
   * @returns {typeof c}
   */
  get c() {
    return c;
  }
}

module.exports = creply;
