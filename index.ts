import c from "chalk";
import * as utils from "./lib/utils";
import readline from "readline";
import { stdin, stdout } from "process";
import events from "events";
import { log } from "console";
import prompt from "./lib/prompt";

process.setMaxListeners(0);

//keypress
readline.emitKeypressEvents(stdin);
if (stdin.isTTY) process.stdin.setRawMode(true);

var emitter = new events();
emitter.setMaxListeners(0);

class creply {
  options: utils.initOptions;
  commands: utils.commands;
  constructor(options: utils.initOptions) {
    this.options = options;
    this.commands = {};
  }
  /**
   * starts the repl process
   */
  async start(): Promise<void> {
    this.handler();
    var opts = this.options;
    this.options.showHelpOnStart &&
      log(
        `${c.gray("welcome to")} ${c.bold(
          this.options.name + " " + this.options.version
        )}\n${c.gray("type")} ${c.blue(this.options.prefix + "help")} ${c.gray(
          "to view help"
        )}`
      );
    emitter.emit("start");
    stdin.on("keypress", (str, key) => {
      emitter.emit("keypress", { ch: str, key: key });
    });
    while (true) {
      const question = await prompt(
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
  eval(args: any): void {
    args = args.replace(this.options.prefix, "").split(" ");
    var cmd: string = args[0];
    var arg: string = args.slice(1).join(" ");
    if (cmd == "") {
      emitter.emit("command-not-specified");
      log(c.red(`error`), `${c.gray("command not specified")}`);
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
          log(`${c.red("command not found:")} ${c.gray(cmd)}`);
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
    stdout.write("\x1Bc");
  }
  /**
   * show help
   */
  help() {
    var opts = this.options;
    log(c.gray(`${opts.name} ${opts.version}`));
    log(c.gray(opts.description));
    log(c.gray(`use the prefix ${c.blue(opts.prefix)} for commands`));

    log(c.bold(`commands:`));
    if (Object.keys(this.commands).length === 0)
      log(c.red(" no commands available"));
    else {
      for (var cmd in this.commands) {
        log(` ${c.blue(cmd)} ${c.gray(this.commands[cmd].description)}`);
      }
    }
    log(c.bold("system commands:"));
    log(` ${c.blue("help")} ${c.gray("show this help")}`);
    log(` ${c.blue("close")} ${c.gray("close the repl")}`);
    log(` ${c.blue("clear")} ${c.gray("clear the repl screen")}`);
  }
  on(event: utils.creplyEvents, callback: any) {
    emitter.on(event, callback);
  }
  /**
   * adds an command to the repl
   * @param cmd the name of command to add
   * @param description the description of the command
   * @param action the action to perform when the command is called
   */
  addCommand(cmd: string, description: string, action: Function) {
    this.commands[cmd.replaceAll(" ", "-")] = {
      description: description,
      action: action
    };
  }
  /**
   * remove a command from the repl
   * @param cmd the command to remove
   */
  removeCommand(cmd: string) {
    if (this.commands[cmd]) delete this.commands[cmd];
  }

  handler() {
    var opts = this.options;
    //on process exit
    process.on("exit", () => {
      log(
        "\n" + c.blue(opts.name),
        c.bold("exited with status"),
        process.exitCode !== undefined ? c.blue(process.exitCode) : c.blue(0)
      );
      emitter.emit(
        "exit",
        process.exitCode !== undefined ? process.exitCode : 0
      );
    });
    //on errors
    process.on("uncaughtException", (e: any) => {
      log(
        `${c.red(e.name !== undefined ? e.name : "error")} ${
          e.message
        } ${c.gray(
          e.stack.replaceAll(e.name, "").replaceAll(e.message, "")
        )}`.replace(":", "")
      );
      emitter.emit("uncaught-error", e);
    });
  }
  get stdin(): typeof stdin {
    return stdin;
  }
  get stdout(): typeof stdout {
    return stdout;
  }
  /**
   * @param type the option to update
   * @param name the option value to update
   */
  update(type: utils.updateTypes, name: string): void {
    const setopt = (
      setType: string,
      value: any
    ): any => //@ts-ignore
      (this.options[setType] = value);

    switch (type) {
      case "promptName":
        setopt(type, name);
        //clear the prompt name
        readline.clearLine(stdin, 0);
        //move the cursor to start of line
        readline.cursorTo(stdin, 0);
        //updates the prompt name
        stdin.write(name);
        break;
      default:
        setopt(type, name);
        break;
    }
  }
}

export default creply;
