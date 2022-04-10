"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
const process_1 = require("process");
const events_1 = __importDefault(require("events"));
const console_1 = require("console");
const prompt_1 = __importDefault(require("./lib/prompt"));
process.setMaxListeners(0);
//keypress
readline_1.default.emitKeypressEvents(process_1.stdin);
if (process_1.stdin.isTTY) process.stdin.setRawMode(true);
var emitter = new events_1.default();
emitter.setMaxListeners(0);
class creply {
  options;
  commands;
  constructor(options) {
    this.options = options;
    this.commands = {};
  }
  /**
   * starts the repl process
   */
  async start() {
    this.handler();
    var opts = this.options;
    this.options.showHelpOnStart &&
      (0, console_1.log)(
        `${chalk_1.default.gray("welcome to")} ${chalk_1.default.bold(
          this.options.name + " " + this.options.version
        )}\n${chalk_1.default.gray("type")} ${chalk_1.default.blue(
          this.options.prefix + "help"
        )} ${chalk_1.default.gray("to view help")}`
      );
    emitter.emit("start");
    process_1.stdin.on("keypress", (str, key) => {
      emitter.emit("keypress", { ch: str, key: key });
    });
    while (true) {
      const question = await (0, prompt_1.default)(
        this.options.promptName,
        this.options.historyFilePath
      );
      emitter.emit("input", question);
      //@ts-ignore
      if (question.startsWith(this.options.prefix)) this.eval(question);
    }
  }
  /**
   * evaluate the repl
   */
  eval(args) {
    args = args.replace(this.options.prefix, "").split(" ");
    var cmd = args[0];
    var arg = args.slice(1).join(" ");
    if (cmd == "") {
      emitter.emit("command-not-specified");
      (0, console_1.log)(
        chalk_1.default.red(`error`),
        `${chalk_1.default.gray("command not specified")}`
      );
    } else {
      if (cmd == "close" || cmd == "help" || cmd == "clear") {
        //@ts-ignore
        this[cmd]();
        emitter.emit("systemCommand", cmd, arg);
      } else {
        if (cmd in this.commands) {
          emitter.emit("command", cmd, arg);
          //if you remove the command the eval will throws error then this if is required
          if (this.commands[cmd]) this.commands[cmd].action(arg);
        } else {
          emitter.emit("command-not-found", cmd);
          (0, console_1.log)(
            `${chalk_1.default.red(
              "command not found:"
            )} ${chalk_1.default.gray(cmd)}`
          );
        }
      }
    }
  }
  /**
   * close the repl
   */
  close() {
    emitter.emit("close");
    process.exit(1);
  }
  /**
   * clear the repl screen
   */
  clear() {
    emitter.emit("clear");
    process_1.stdout.write("\x1Bc");
  }
  /**
   * show help
   */
  help() {
    var opts = this.options;
    (0, console_1.log)(chalk_1.default.gray(`${opts.name} ${opts.version}`));
    (0, console_1.log)(chalk_1.default.gray(opts.description));
    (0, console_1.log)(
      chalk_1.default.gray(
        `use the prefix ${chalk_1.default.blue(opts.prefix)} for commands`
      )
    );
    (0, console_1.log)(chalk_1.default.bold(`commands:`));
    if (Object.keys(this.commands).length === 0)
      (0, console_1.log)(chalk_1.default.red(" no commands available"));
    else {
      for (var cmd in this.commands) {
        (0, console_1.log)(
          ` ${chalk_1.default.blue(cmd)} ${chalk_1.default.gray(
            this.commands[cmd].description
          )}`
        );
      }
    }
    (0, console_1.log)(chalk_1.default.bold("system commands:"));
    (0, console_1.log)(
      ` ${chalk_1.default.blue("help")} ${chalk_1.default.gray(
        "show this help"
      )}`
    );
    (0, console_1.log)(
      ` ${chalk_1.default.blue("close")} ${chalk_1.default.gray(
        "close the repl"
      )}`
    );
    (0, console_1.log)(
      ` ${chalk_1.default.blue("clear")} ${chalk_1.default.gray(
        "clear the repl screen"
      )}`
    );
  }
  on(event, callback) {
    emitter.on(event, callback);
  }
  /**
   * adds an command to the repl
   * @param cmd the name of command to add
   * @param description the description of the command
   * @param action the action to perform when the command is called
   */
  addCommand(cmd, description, action) {
    this.commands[cmd.replaceAll(" ", "-")] = {
      description: description,
      action: action
    };
  }
  /**
   * remove a command from the repl
   * @param cmd the command to remove
   */
  removeCommand(cmd) {
    if (this.commands[cmd]) delete this.commands[cmd];
  }
  handler() {
    var opts = this.options;
    //on process exit
    process.on("exit", () => {
      (0, console_1.log)(
        "\n" + chalk_1.default.blue(opts.name),
        chalk_1.default.bold("exited with status"),
        process.exitCode !== undefined
          ? chalk_1.default.blue(process.exitCode)
          : chalk_1.default.blue(0)
      );
      emitter.emit(
        "exit",
        process.exitCode !== undefined ? process.exitCode : 0
      );
    });
    //on errors
    process.on("uncaughtException", (e) => {
      (0, console_1.log)(
        `${chalk_1.default.red(e.name !== undefined ? e.name : "error")} ${
          e.message
        } ${chalk_1.default.gray(
          e.stack.replaceAll(e.name, "").replaceAll(e.message, "")
        )}`.replace(":", "")
      );
      emitter.emit("uncaught-error", e);
    });
  }
  get stdin() {
    return process_1.stdin;
  }
  get stdout() {
    return process_1.stdout;
  }
  /**
   * @param type the option to update
   * @param name the option value to update
   */
  update(type, name) {
    const setopt = (
      setType,
      value //@ts-ignore
    ) => (this.options[setType] = value);
    switch (type) {
      case "promptName":
        setopt(type, name);
        //clear the prompt name
        readline_1.default.clearLine(process_1.stdin, 0);
        //move the cursor to start of line
        readline_1.default.cursorTo(process_1.stdin, 0);
        //updates the prompt name
        process_1.stdin.write(name);
        break;
      default:
        setopt(type, name);
        break;
    }
  }
}
module.exports = creply;
