<!-- markdownlint-disable MD015 MD033 MD038 -->

# creply

> create read–eval–print-loop (repl) programs<br>
> want to create a repl? with creply you create easily<br>
> you can use it with TypeScript too!

- also see the documetation generated by [typedoc](https://otoniel19.github.io/creply)

## creating the repl

```js
const creply = require("creply");
const repl = new creply({
  name: "app",
  description: "simple node.js repl app",
  version: "v1.0.0",
  history: "app.history",
  prompt: "app> ",
  prefix: "!"
});
```

- this will create a repl with the following options:

```json
{
  "name": "app",
  "description": "simple node.js repl app",
  "version": "v1.0.0",
  "history": "app.history",
  "prompt": "app> ",
  "prefix": "!"
}
```

## starting the repl

```js
repl.start();
```

- this will start the repl and output the following:

```sh
app>
```

## adding commands

- commands are added with the `repl.addCommand()` method
- commands are saved in the `repl.commands` object

```js
repl.addCommand(
  "hello",
  "say hello",
  (args) => {
    console.log("hello " + args);
  },
  () => {
    return "hello [name]";
  }
);
```

- this will add a command with the following options:

```json
{
  "description": "say hello",
  "exec": "[Function: exec]",
  "usage": "[Function: usage]"
}
```

## removing commands

- commands are removed with the `repl.removeCommand()` method

```js
repl.removeCommand("hello");
```

- this will remove the command with the name `hello`
- the command will be removed from the `repl.commands` object

## updating options

- options are updated with the `repl.set()` method
- options are saved in the `repl.options` object
- example updating the prompt

```js
repl.set({
  prompt: "cli> "
});
```

- this will update the prompt to `cli> `
- output will be:

```sh
cli>
```

## getting options

- options are retrieved with the `repl.get()` method

```js
console.log(repl.get("prompt"));
```

- this will output the prompt
- output will be:

```sh
cli>
```

## listening to events

- events are listen with the `repl.on()` method
- when you listen an event the repl will not prints the data except the events `uncaught-error` and `unhandled-rejection`

- example listening to the `line` event
- the event will be called when the user types a line

```js
repl.on("line", (line) => {
  console.log("line: " + line);
});
```

- example listening to the `uncaught-error` event
- the event will be called when the repl throws an error

````js

```js
repl.on("uncaught-error", (err) => {
  console.log("uncaught-error: " + err);
});
````

- example listening the `keypress` event
- the event will be called when the user press a key

```js
repl.on("keypress", (char, key) => {
  console.log("keypress: " + key);
});
```

- example listening to the `unhandled-rejection` event
- this event will be called when the repl has an unhandled rejection

```js
repl.on("unhandled-rejection", (reason, promise) => {
  console.log("unhandled-rejection: " + reason);
});
```

- example listening to the `exit` event
- this event will be called when the repl is closed

```js
repl.on("exit", () => {
  console.log("exit");
});
```

- example listening to the `cursor-move` event
- this event will be called when the cursor moves

```js
repl.on("cursor-move", (cursor) => {
  console.log("cursor-move: " + cursor);
});
```

- example listening to the `command` event
- this event will be called when the repl executes a command

```js
repl.on("command", (command, args) => {
  console.log("command: " + command);
});
```

- example listening to the `command-not-found` event
- this event will be called when the repl executes a command that doesn't exist

```js
repl.on("command-not-found", (command) => {
  console.log("command-not-found: " + command);
});
```

- example listening to the `did-you-mean` event
- this event will be called when repl try to mean the command

```js
repl.on("did-you-mean", (command, didYouMean) => {
  console.log("did-you-mean: " + didYouMean);
});
```

- example listening to the `command-not-specified` event
- this event will be called when the repl executes a command that doesn't have a name

```js
repl.on("command-not-specified", () => {
  console.log("command-not-specified");
});
```

- example listening to the `start` event
- this event is triggered when the repl starts
- the listener must be before the `repl.start() ` call

```js
repl.on("start", () => {
  console.log("started!");
});
```
