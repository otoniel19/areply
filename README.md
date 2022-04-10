<!-- markdownlint-disable MD015 MD033 -->

# creply

[see a more detailed documentation](https://otoniel19.github.io/creply/)

- create read-eval-print-loop programs

# creating a repl

```js
const creply = require("creply");
const repls = new creply({
  name: "test",
  prefix: "!",
  description: "test",
  version: "1.0.0",
  promptName: "> ",
  showHelpOnStart: true,
  historyFilePath: "./repl"
});
```

- this is the base of creating a repl

# starting the repl

```js
repl.start(); // this starts the repl
```

# adding and removing commands

- to add a command use repl.addCommand

```js
//this adds a command
repl.addCommand("cmd", "run a bash command", (args) => {
  const data = args.split(" ");
  const cmd = data[0];
  const cmdArgs = cmd.slice(1);
  require("child_process").spawnSync(cmd, cmdArgs, { stdio: "inherit" });
});
```

- when the command is called the function called "action" will be auto called passing args to the function

- to remove a command use repl.removeCommand

```js
repl.removeCommand("cmd"); // this will remove the defined command created above
```

# closing and cleaning console

- to close you can use repl.close
- to clear you can use repl.clear
- or you can type on the repl starting with your prefix
- example:

```sh
> !close # will close the repl
> !clear # will clear the repl console
```

# listening for events

> you can listen for the events:<br>

- "start"
- "close"
- "clear"
- "input"
- "command"
- "systemCommand"
- "exit"
- "command-not-found"
- "command-not-specified"
- "uncaught-error"
- "keypress"

- examples

```js
//make sure that this listener is before the repl.start
repl.on("start", () => {});

//on repl close
repl.on("close", () => {});

//when the repl is cleared
repl.on("clear", () => {});

//the user input
repl.on("input", (input) => {});

//when a command is called
repl.on("command", (cmdName, cmdArgs) => {});

//when a system command is called
repl.on("systemCommand", (cmdName, cmdArgs));

//when a command was not found
repl.on("command-not-found", (name) => {});

//when a command is not specified
repl.on("command-not-specified", () => {});

//when a error is throwed
repl.on("uncaught-error", (e) => {});

//when user press a key
repl.on("keypress", ({ ch, key }) => {});

//when the repl exits
repl.on("exit", (code) => {});
```
