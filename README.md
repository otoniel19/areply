# areply

> the read-eval-print-loop creator for node.js

# features

> you can add commands
> listen keypresses
> listen for user commands
> listen for user inputs
> save history

# usage

# create a simple repl

```js
const areply = require("areply");
const repl = new areply(
  "history-file.txt",
  "my-repl-name",
  "my-repl-prefix",
  "my-repl-version",
  "my-repl-original-name",
  "my-repl-description"
);
```

> explanation:

- first arg is the history file to save the repl history
- second arg is the name to show on questions
- third arg is the prefix of commands
- fourth arg is the version of repl
- fifth arg is the original name of the repl
- last arg is the description of repl

# start the repl

```js
repl.start();
```

- this will start the repl process

# create a command

```js
repl.addCommand("command-name", "command-description", commandFunction);
```

> explanation:

- first arg is the name of command
- second arg is the description of command
- last arg is the function that will be called when user call the command

# listening events

```js
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
repl.on("line", (line) => {
  //the full repl input
});
```
