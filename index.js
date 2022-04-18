//@ts-nocheck
const readline = require("readline");
const fs = require("fs");
const c = require("chalk");
const { log } = console;
const { EventEmitter } = require("events");
const utils = require("./utils");

const emitter = new EventEmitter();
process.setMaxListeners(0);
emitter.setMaxListeners(0);

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

/**
 * @param {string} file
 * @returns {string[]}
 */
const getHistory = (file) =>
  fs
    .readFileSync(file, "utf8")
    .split(/r?\n/)
    .filter((o) => o !== "")
    .reverse();

/**
 * only logs if eventName dont have none listeners
 * @param {string} eventName
 * @param {any[]} data
 */
const logl = (eventName, ...data) => {
  if (emitter.listenerCount(eventName) === 0) {
    log(...data);
  }
};

class creply {
  /**
   * create a new repl
   * @param {options} options the creply options
   * @typedef {{ name: string; version: string; description: string; history: string; prefix: string; prompt: string }} options
   * @example
   * ```js
   * const creply = require("creply");
   * const repl = new creply({
   * 	 name: "app",
   * 	 version: "1.0.0",
   * 	 description: "my repl",
   * 	 history: "./history.txt",
   * 	 prefix: "!",
   * 	 prompt: "> "
   * });
   * ```
   */
  constructor(options) {
    /**
     * @type {options}
     * @private
     */
    this.options = options;
    /**
     * all the commands created by the creply.addCommand method
     * @type command
     * @typedef {{ [name: string]: { description: string; usage: () => string; exec: (args: any) => void }}} command
     */
    this.commands = {};
    /**
     * the repl system commands
     * @typedef {{ [name: string]: { description: string; exec: (args: any) => void }}} sysCommand
     * @type {sysCommand}
     * @private
     */
    this.sysCommands = {
      help: {
        description: "show this help",
        exec: (arg) => (arg !== "" ? this.usage(arg) : this.help())
      },
      clear: {
        description: "clear the screen",
        exec: () => this.clear()
      },
      exit: {
        description: "exit the repl",
        exec: () => this.exit()
      },
      history: {
        description: "show the history",
        exec: (argv) => {
          const historyRl = readline.createInterface({
            input: fs.createReadStream(options.history),
            crlfDelay: Infinity
          });
          var array = [];
          historyRl.on("line", (line) => {
            if (line !== "") {
              array.push(line);
            }
          });

          historyRl.on("close", () => {
            argv === ""
              ? (log("\n"),
                array.forEach((o, idx) => {
                  var id = idx + 1;
                  log(id.toString(), o);
                }),
                this.set({ prompt: options.prompt }))
              : (() => {
                  this.log(array[argv + 1]);
                })();
          });
        }
      }
    };
  }
  /**
   * the readline.Interface instance
   * @returns {Promise<string>}
   * @param {string} history - history file
   */
  async interface(history) {
    if (!fs.existsSync(history)) fs.appendFileSync(history, "");
    var rlHistory = getHistory(history);
    /** @type {readline.Interface} */
    global.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      history: rlHistory,
      historySize: rlHistory.length,
      removeHistoryDuplicates: true,
      completer: (line) => {
        line = line.replace(this.options.prefix, "");
        const completions = [
          ...Object.keys(this.sysCommands),
          ...Object.keys(this.commands)
        ];
        const hits = completions.filter((c) => c.startsWith(line));
        // show all completions if none found
        return [hits.length ? hits : completions, line];
      }
    });
    return new Promise((resolve, reject) => {
      rl.question(this.options.prompt, (line) => {
        resolve(line);
        rl.close();
      });
      //refresh the line
      process.stdin.on("keypress", (str, key) =>
        setTimeout(() => rl._refreshLine(), 0)
      );
      //syntax highlighting
      var options = this.options;
      rl._writeToOutput = (line) => {
        var str = line.replace(options.prompt, "");
        var allCommands = [
          ...Object.keys(this.sysCommands),
          ...Object.keys(this.commands)
        ];
        //highlights prefix and command name
        if (str.startsWith(options.prefix)) {
          //name of command
          var cmd = str.replace(options.prefix, "").split(" ")[0] || "";
          line = line.replace(options.prefix, c.blue(options.prefix));
          var has = (str) => allCommands.indexOf(str) !== -1;
          //if is a command then highlight the command name
          if (has(cmd)) line = line.replace(cmd, c.blue(cmd));
          else line = line.replace(cmd, c.red(cmd));
        }
        //apply the syntax highlighting
        rl.output.write(line);
      };
    });
  }
  /**
   * @typedef {"command" | "exit" | "start" | "uncaught-error" | "keypress" | "line" | "cursor-move" | "command-not-found" | "command-not-specified" | "did-you-mean"} events eventName
   * @param {events} eventName
   * @param {any} listener
   * @example
   * ```js
   * repl.on("line",(line) => {
   *   console.log("Hello "+line);
   * });
   * ```
   */
  on(eventName, listener) {
    if (!listener)
      new utils.error({
        message: `the listener callback cannot be undefined`
      });
    if (typeof listener !== "function")
      new utils.error({
        message: `the listener callback must be a function`
      });
    if (!eventName)
      new utils.error({
        message: `the eventName cannot be undefined`
      });
    var eventsArray = [
      "command",
      "exit",
      "start",
      "uncaught-error",
      "keypress",
      "line",
      "cursor-move",
      "command-not-found",
      "command-not-specified",
      "did-you-mean"
    ];
    //check if eventName is a valid event
    if (!eventsArray.includes(eventName))
      new utils.error({
        message: `the event ${c.yellow(
          eventName
        )} is not a valid event valid events are -> ${c.yellow(
          eventsArray.join(c.gray(", "))
        )}`
      });
    emitter.on(eventName, listener);
  }
  /**
   * starts the repl
   * @returns {Promise<void>}
   * @example
   * ```js
   * repl.start() // will start the repl
   * ```
   */
  async start() {
    emitter.emit("start");
    this.handler();
    var options = this.options;
    process.stdin.on("keypress", (ch, key) => {
      if (key.ctrl && key.name === "c") {
        process.exit();
      }
      /**
       * @event keypress
       * @type {cols: number; rows: number}
       */
      const cursor = global.rl.getCursorPos();
      /**
       * @event keypress
       * @type {any}
       */
      const char = ch;
      /**
       * @event keypress
       * @type { sequence: string; name: string; ctrl: boolean; meta: boolean; shift: boolean }
       */
      const pressKey = key;
      emitter.emit("keypress", char, pressKey);
      emitter.emit("cursor-move", cursor);
    });
    while (true) {
      var rl = this.interface(options.history);
      const line = await rl;
      emitter.emit("line", line);
      fs.appendFileSync(options.history, "\n" + line);
      if (line.startsWith(options.prefix)) this.eval(line);
    }
  }
  /**
   * evals the repl input line
   * @param {string} line
   * @example
   * ```js
   * repl.eval("!help") // will eval the command "help"
   * ```
   * @returns {void}
   */
  eval(line) {
    const options = this.options;
    const data = line.replace(options.prefix, "").split(" ");
    const command = data[0];
    const args = data.slice(1).join("");
    if (command !== "") {
      if (command in this.sysCommands) {
        this.sysCommands[command].exec(args);
      } else {
        if (command in this.commands) {
          emitter.emit("command", command, args);
          //if the command was removed this if is required
          if (this.commands[command]) this.commands[command].exec(args);
        } else {
          var mean = utils.findMean(command, [
            ...Object.keys(this.sysCommands),
            ...Object.keys(this.commands)
          ]);
          //.filter((o) => o !== undefined);
          emitter.emit("command-not-found", command);
          logl(
            "command-not-found",
            c.red("command not found:"),
            c.blue(command)
          );
          if (mean.length > 0) {
            emitter.emit("did-you-mean", command, mean);
            logl("did-you-mean", c.red("did you mean:"));
            mean.forEach((o) => log(` ${c.blue(o)}`));
          }
        }
      }
    } else {
      emitter.emit("command-not-specified");
      logl(
        "command-not-specified",
        c.red("error"),
        c.gray("command not specified")
      );
    }
  }
  /**
   * prints the help
   * @example
   * ```js
   * repl.help() // will print the help
   * ```
   * @returns {void}
   */
  help() {
    log(`${this.options.name} ${this.options.version}`);
    log(this.options.description + "\n");
    log(c.gray("press tab to autocomplete"));
    log(c.gray(`use the prefix ${c.blue(this.options.prefix)} for commands\n`));
    log(c.bold("commands"));
    var cmdKeys = Object.keys(this.commands);
    cmdKeys.length > 0
      ? cmdKeys.forEach((o) => {
          log(` ${c.blue(o)} - ${this.commands[o].description}`);
        })
      : log(c.red(" no commands"));
    log(c.bold("system commands"));
    var sysKeys = Object.keys(this.sysCommands);
    sysKeys.forEach((o) => {
      log(` ${c.blue(o)} - ${this.sysCommands[o].description}`);
    });
  }
  /**
   * clears the screen
   * @example
   * ```js
   * repl.clear() // will clear the screen
   * ```
   * @returns {void}
   */
  clear() {
    process.stdout.write("\x1Bc");
  }
  /**
   * exits the repl
   * @example
   * ```js
   * repl.exit() // will exit the repl
   * ```
   * @returns {void}
   */
  exit() {
    process.exit(0);
  }
  /**
   * show usage of a command
   * only works with user commands
   * @param {string} command the name of the command
   * @example
   * ```js
   * repl.usage("say") // will show the usage of the command "say"
   * ```
   * @returns {void}
   */
  usage(command) {
    if (command in this.commands) {
      log(this.commands[command].usage());
    } else {
      if (command == "") {
        emitter.emit("command-not-specified");
        logl(
          "command-not-specified",
          c.red("error"),
          c.gray("command not specified")
        );
      } else {
        emitter.emit("command-not-found", command);
        logl("command-not-found", c.red("command not found:"), c.blue(command));
        var mean = utils.findMean(command, Object.keys(this.commands));
        if (mean.length > 0) {
          emitter.emit("did-you-mean", mean);
          logl("did-you-mean", c.red("did you mean:"));
          mean.forEach((o) => log(` ${c.blue(o)}`));
        }
      }
    }
  }
  /**
   * handle things like:
   * - on process exit
   * - on error
   * if an error is thrown and the error comes with `process.exit()` the repl will exit
   * @private
   */
  handler() {
    process.on("exit", (code) => {
      emitter.emit("exit", code);
      logl(
        "exit",
        `\n${c.blue(this.options.name)} ${c.bold(
          "exited with status"
        )} ${c.blue(code)}`
      );
    });
    process.on("uncaughtException", (e) => {
      if (e.name === "replError") {
        log(
          `\n${c.red(e.name)} ${c.bold(e.message.replaceAll(":", ""))} ${c.gray(
            e.stack
              .replaceAll(e.name, "")
              .replaceAll(e.message, "")
              .replace(":", "")
          )}`
        );
        process.exit(1);
      } else {
        log(
          `\n${c.red(e.name)} ${c.bold(e.message)} ${c.gray(
            e.stack.replaceAll(e.name, "").replaceAll(e.message, "")
          )}`.replace(":", "")
        );
        emitter.emit("uncaught-error", e);
        //resumes the prompt after an error
        process.stdin.write(this.options.prompt);
      }
    });
  }
  /**
   * adds a command
   * @param {string} name the name of the command
   * @typedef {{ description: string; exec: (args: any) => void; usage: () => string }} addCommandOptions
   * @example
   * ```js
   * repl.addCommand("say", {
   * 	description: "says something",
   * 	exec: (args) => {
   * 		console.log(args);
   * 	},
   * 	usage: () => {
   * 		return "say <something>";
   * 	}
   * });
   * ```
   * @param {addCommandOptions} options
   * @returns {void}
   */
  addCommand(name, options) {
    this.commands[name] = {
      description: options.description,
      exec: options.exec,
      usage: options.usage
    };
  }
  /**
   * remove a command
   * @example
   * ```js
   * repl.removeCommand("say") // will remove the command "say"
   * ```
   * @param {string} name the name of the command to remove
   */
  removeCommand(name) {
    if (this.commands[name]) delete this.commands[name];
  }
  /**
   * set a option
   * @param {Partial<options>} keys
   * @example
   * ```js
   * repl.set({
   *  prompt: "> ",
   *  name: "my-repl",
   *  version: "1.0.0",
   *  description: "my description"
   * });
   * ```
   * @returns {void}
   */
  set(keys) {
    Object.keys(keys).forEach((name) => {
      var value = keys[name];
      //@ts-ignore
      if (name === "prompt") {
        readline.clearLine(process.stdin, 0);
        readline.cursorTo(process.stdin, 0);
        this.options["prompt"] = value;
        process.stdin.write(value);
        //@ts-ignore
      } else this.options[name] = value;
    });
  }
  /**
   * get a option
   * @example
   * ```js
   * repl.get("prompt") // will return the prompt
   * ```
   * @typedef {"name" | "description" | "prompt" | "history" | "version" | "prefix"} optionsNames
   * @param {optionsNames} name the name of the option
   * @returns {any} the value of the option
   */
  get(name) {
    if (!name) new utils.error({ message: "name of the option not specified" });
    return this.options[name];
  }
  /**
   * the readline used by creply
   * @example
   * ```js
   * repl.readline // will return the readline used by creply
   * ```
   * @returns {readline}
   */
  get readline() {
    return readline;
  }
  /**
   * the readline interface used by creply
   * first start the repl to get the readline interface
   * @returns {readline.Interface}
   */
  get rl() {
    return global.rl;
  }
  /**
   * @param {any[]} data
   */
  log(...data) {
    console.log(...data);
    this.set({ prompt: this.options.prompt });
  }
}

module.exports = creply;
