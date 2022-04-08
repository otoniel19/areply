export = areply;
declare class areply extends events {
    /**
     * @param {string} historyFile the file to save the history
     * @param {string} replName the name of the repl
     * @param {string} commandsPrefix the prefix of repl commands
     * @param {string} version the version of the repl
     * @param {string} originalName the original name of the repl
     * @param {string} description the description of the repl
     */
    constructor(historyFile: string, replName: string, commandsPrefix: string, version: string, originalName: string, description: string);
    historyFile: string;
    name: string;
    prefix: string;
    version: string;
    originalName: string;
    description: string;
    /** @type {any[]} */
    commands: any[];
    start(): Promise<void>;
    /**
     * the areply eval used by the repl
     * @param {string} args the repl arguments
     * @returns {void}
     */
    eval(args: string): void;
    /**
     * close the repl
     */
    close(): void;
    /**
     * add a command to the repl
     * @param {string} name the command name
     * @param {function} fn the function to execute when command is called
     * @param {string} description the description of the command
     */
    addCommand(name: string, description: string, fn: Function): void;
    /**
     * outputs help
     */
    help(): void;
    /**
     * chalk
     * @returns {typeof c}
     */
    get c(): c.Chalk & c.ChalkFunction & {
        supportsColor: false | c.ColorSupport;
        Level: c.Level;
        Color: ("black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright") | ("bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright");
        ForegroundColor: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
        BackgroundColor: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        Modifiers: "reset" | "bold" | "dim" | "italic" | "underline" | "inverse" | "hidden" | "strikethrough" | "visible";
        stderr: c.Chalk & {
            supportsColor: false | c.ColorSupport;
        };
    };
}
import events = require("events");
import c = require("chalk");
