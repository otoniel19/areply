export interface initOptions {
  /**
   * the name of prompt
   */
  readonly promptName: string;
  /**
   * the name of repl
   */
  readonly name: string;
  /**
   * the description of repl
   */
  readonly description: string;
  /**
   * the version of repl
   */
  readonly version: string;
  /**
   * the commands prefix
   */
  readonly prefix: string;
  /**
   * the history file path
   */
  readonly historyFilePath: string;
  /**
   * show help for usage when repl starts
   */
  readonly showHelpOnStart: boolean;
}

export type creplyEvents =
  | "start"
  | "close"
  | "clear"
  | "input"
  | "command"
  | "systemCommand"
  | "exit"
  | "command-not-found"
  | "command-not-specified"
  | "uncaught-error"
  | "keypress";

export interface commands {
  [command: string]: {
    description: string;
    action: any;
  };
}
