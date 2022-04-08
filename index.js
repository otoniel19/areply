const prompt = require("./prompt");
const { stdin } = require("process");
const readline = require("readline");
const c = require("chalk");
const { log } = console;
const meant = require("meant");

readline.emitKeypressEvents(stdin);

const events = require("events");

class areply extends events {
  /**
   * @param {string} historyFile the file to save the history
   * @param {string} replName the name of the repl
   * @param {string} commandsPrefix the prefix of repl commands
   * @param {string} version the version of the repl
   * @param {string} originalName the original name of the repl
   * @param {string} description the description of the repl
   */
  constructor(
    historyFile,
    replName,
    commandsPrefix,
    version,
    originalName,
    description
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
   * the areply eval used by the repl
   * @param {string} args the repl arguments
   * @returns {void}
   */
  eval(args) {
    const data = args.replace(this.prefix, "").split(" ");
    const command = data[0];
    data.shift();
    const commandArgs = data.join(" ");
    if (command == "help") {
      this.help();
      return;
    } else if (command == "close") {
      this.close();
    } else {
      for (const commandObj of this.commands) {
        if (commandObj.name === command) {
          commandObj.fn(commandArgs);
        } else {
          log(`${c.red("command not found:")} ${c.gray(command)}`);
          var list = ["help", "close"];
          this.commands.forEach(({ name }) => list.push(name));
          var youMean = meant(command, list);
          youMean != null
            ? log(`${c.gray("did you mean:")} ${c.green(youMean)}?`)
            : "";
        }
      }
    }
    this.emit("command", {
      cmd: command,
      args: { string: commandArgs, array: data }
    });
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
      name: name,
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
    this.commands.forEach((key) => {
      log(` ${c.green(key.name)} ${c.grey("->")} ${c.grey(key.desc)}`);
    });

    log(`${c.gray("system commands:")}`);
    log(` ${c.green("close")} ${c.grey("->")} ${c.grey("close the repl")}`);
    log(` ${c.green("help")} ${c.grey("->")} ${c.grey("show this help")}`);
  }
  /**
   * chalk
   * @returns {typeof c}
   */
  get c() {
    return c;
  }
}

module.exports = areply;
