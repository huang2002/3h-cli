# 3h-cli
> A cli lib.

## Install
```
$ npm install 3h-cli
```

## Example
### In `MyCLI.js`:
```javascript
const CLI = require('3h-cli');

const cli = CLI.create({
    name: 'MyCLI',
    title: 'Here is the title.'
}).set({
    filter: true,
    tabSize: 3,
    nameSize: 10,
    gapSize: 6
}).first({
    name: 'a',
    val: 'v1',
    help: 'Help for\nthe first arg.'
}).arg({
    name: 'h',
    alias: ['help'],
    help: 'Show this.'
}).arg({
    name: 'b',
    val: 'v2',
    help: 'Arg "b".'
}).on('extra', key => {
    console.log(`Unknown arg "${key}"!`);
}).on('error', err => {
    console.log('An error occurred!');
    console.error(err);
}).on('exec', args => {
    args.forEach((v, k) => {
        console.log(`Received ${k}->${JSON.stringify(v)}.`);
    });
    if (args.has('h')) {
        console.log('(Here is the help info:)');
        cli.help();
    }
}).exec(process.argv);
```
### In the command line:
```
> node MyCLI firstArg
Received a->["firstArg"].

>node MyCLI -help
Received h->[].
(Here is the help info:)
Here is the title.

MyCLI <v1> [options]

   <v1>            Help for
                   the first arg.
   -h, -help       Show this.
   -b        <v2>  Arg "b".

```

## API
Just read `3h-cli.d.ts` to learn about the APIs. ( By the way, that file is specified in `package.json` for typescript users. )