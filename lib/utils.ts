export interface initOptions {
  /**
   * the name of prompt
   */
  promptName: string;
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
  | "keypress"
  | "did-you-mean";

export interface commands {
  [command: string]: {
    description: string;
    action: any;
  };
}

export type updateTypes =
  | "name"
  | "prefix"
  | "description"
  | "showHelpOnStart"
  | "historyFilePath"
  | "promptName"
  | "version";

//did you mean
export const didYouMean = (input: string, list: any[]): string[] => {
  var bestMatch: string[] = [];
  list.map((word: string, idx: number) => {
    var W: string = word.toLowerCase();
    var I: string = input.toLowerCase();
    if (I === W) {
      bestMatch.push(word);
    }
    if (I.startsWith(word[idx])) {
      var filter: string[] = list.filter((o) => o.startsWith(word[idx]));
      bestMatch = [...bestMatch, ...filter];
    }
    if (input.includes(word)) {
      var filter: string[] = list.filter((o) => input.includes(word));
      bestMatch = [...bestMatch, ...filter];
    }
  });
  bestMatch = [...new Set(bestMatch)];
  return bestMatch;
};
