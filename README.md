<!-- markdownlint-disable MD033 MD013 -->

# creply

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![downloads-month](https://img.shields.io/npm/dm/creply.svg?style=flat)
![downloads-week](https://img.shields.io/npm/dw/creply.svg?style=flat)

> the read-eval-print-loop creator for node.js

# features

> you can add commands<br>
> listen events<br>
> save history<br>
> handle errors<br>
> handle process exits

# usage

# create a simple repl

```js
const creply = require("creply");
const repl = new creply(
  "history-file.txt",
  "my-repl-name",
  "my-repl-prefix",
  "my-repl-version",
  "my-repl-original-name",
  "my-repl-description",
  true
);
```

> explanation:

- first arg is the history file to save the repl history
- second arg is the name to show on questions
- third arg is the prefix of commands
- fourth arg is the version of repl
- fifth arg is the original name of the repl
- sixth arg is the description of repl
- last arg is for show help on the repl start if true will show a help with prefix name and version output will be like:
  > welcome to repl v1.0.0<br>
  > type !help to view help

# start the repl

```js
repl.start();
```

- this will start the repl process

# create a command

```js
repl.addCommand(
  "command-name",
  "command-description",
  (commandArguments) => {}
);
```

> explanation:

- first arg is the name of command
- second arg is the description of command
- last arg is the function that will be called when user call the command

# listening events

```js
//repl start
repl.on("start", () => {
  // do something
});
//repl close
repl.on("close", () => {
  // do something
});
//keypress
repl.on("keypress", ({ ch, key }) => {
  // the ch is the char
  // the key is the key pressed info
});
//command
repl.on("command", (data) => {
  // this returns the command name and arguments parsed in string and array
});
//user input
repl.on("input", (line) => {
  //the full repl input
});
//on error
repl.on("uncaught-error", (e) => {});
```
