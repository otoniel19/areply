export = creply;
declare class creply {
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
    constructor(options: {
        name: string;
        version: string;
        description: string;
        history: string;
        prefix: string;
        prompt: string;
    });
    /** @type {options} */
    options: {
        name: string;
        version: string;
        description: string;
        history: string;
        prefix: string;
        prompt: string;
    };
    /**
     * all the commands created by the creply.addCommand method
     * @type command
     * @typedef {{ [name: string]: { description: string; usage: () => string; exec: (args: any) => void }}} command
     */
    commands: {
        [name: string]: {
            description: string;
            usage: () => string;
            exec: (args: any) => void;
        };
    };
    /**
     * the readline.Interface instance
     * @returns {Promise<string>}
     * @param {string} history - history file
     */
    interface(history: string): Promise<string>;
    /**
     * @typedef {"command" | "exit" | "start" | "uncaught-error" | "keypress" | "line" | "cursor-move" | "command-not-found" | "command-not-specified" | "did-you-mean"} events eventName
     * @param {events} eventName
     * @param {any} listener
     * @example
     * ```js
     * repl.on("keypress", (char, key) => {
     *   console.log("key press:",key.name)
     * });
     * ```
     */
    on(eventName: "command" | "exit" | "start" | "uncaught-error" | "keypress" | "line" | "cursor-move" | "command-not-found" | "command-not-specified" | "did-you-mean", listener: any): void;
    /**
     * starts the repl
     * @returns {Promise<void>}
     * @example
     * ```js
     * repl.start() // will start the repl
     * ```
     */
    start(): Promise<void>;
    /**
     * evals the repl input line
     * @param {string} line
     * @example
     * ```js
     * repl.eval("!help") // will eval the command "help"
     * ```
     * @returns {void}
     */
    eval(line: string): void;
    /**
     * prints the help
     * @example
     * ```js
     * repl.help() // will print the help
     * ```
     * @returns {void}
     */
    help(): void;
    /**
     * clears the screen
     * @example
     * ```js
     * repl.clear() // will clear the screen
     * ```
     * @returns {void}
     */
    clear(): void;
    /**
     * exits the repl
     * @example
     * ```js
     * repl.exit() // will exit the repl
     * ```
     * @returns {void}
     */
    exit(): void;
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
    usage(command: string): void;
    /**
     * handle things like:
     * - on process exit
     * - on error
     */
    handler(): void;
    /**
     * adds a command
     * @param {string} name the name of the command
     * @param {string} description the description of the command
     * @param {(args: any) => void} exec the action of the command
     * @param {() => string} usage the usage of the command
     * @example
     * ```js
     * repl.addCommand("say", "says something", (args) => {
     * 	console.log(args)
     * 	}, () => {
     * 		return "say <something>"
     * 	}
     * });
     * ```
     * @returns {void}
     */
    addCommand(name: string, description: string, exec: (args: any) => void, usage: () => string): void;
    /**
     * remove a command
     * @example
     * ```js
     * repl.removeCommand("say") // will remove the command "say"
     * ```
     * @param {string} name the name of the command to remove
     */
    removeCommand(name: string): void;
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
    set(keys: Partial<{
        name: string;
        version: string;
        description: string;
        history: string;
        prefix: string;
        prompt: string;
    }>): void;
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
    get(name: "name" | "version" | "description" | "history" | "prefix" | "prompt"): any;
    /**
     * the readline used by creply
     * @example
     * ```js
     * repl.readline // will return the readline used by creply
     * ```
     * @returns {readline}
     */
    get readline(): readline;
    /**
     * the readline interface used by creply
     * first start the repl to get the readline interface
     * @returns {readline.Interface}
     */
    get rl(): readline.Interface;
}
