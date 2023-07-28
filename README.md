# 3h-cli

> A cli program lib.

## Example

```bash
npm i 3h-cli
```

```js
/* my-cli.js */
#!/usr/bin/env node
const { Program } = require('3h-cli');

const program = new Program('my-cli', {
    title: 'This is my-cli.',
});

program
    .action({
        name: 'foo',
        help: 'action foo'
    })
    .action({
        name: 'bar',
        help: 'action bar'
    })
    .option({
        name: '--baz',
        alias: '-b',
        value: '<val>',
        help: 'option baz'
    })
    .option({
        name: '--help',
        alias: '-h',
        help: 'show help info\nlike this'
    })
    .rest({
        value: '[args...]',
        help: 'other args'
    })
    .parse(process.argv)
    .then(args => {
        console.log('received actions:', args.actions);
        console.log('received options:', args.options);
        console.log('other args:', args.rest);
        console.log('--------------------------------');
        if (args.options.has('--help')) {
            return program.help();
        }
    }, err => {
        console.error(err);
        process.exit(1);
    })
```

```bash
$ ./my-cli.js --help
received actions: []
received options: Map { '--help' => [] }
other args: []
--------------------------------
This is my-cli.

Usage:
  my-cli <action> [options] -- [args...]

actions:
  foo                 action foo
  bar                 action bar

Options:
  --baz, -b <val>     option baz
  --help, -h          show help info
                      like this
  -- [args...]        other args

```

## API Reference

*The API reference is written in TypeScript style.*

```ts
class Args {

    constructor(
        actions: string[],
        options: Map<string, string[]>,
        rest: string[]
    );

    readonly actions: string[];
    readonly options: Map<string, string[]>;
    readonly rest: string[];

    /**
     * A utility method that returns
     * the specific option if it exists
     * or an empty array otherwise
     */
    getOption(name: string): string[];

}

interface Args {
    actions: string[];
    options: Map<string, string[]>;
    rest: string[];
}

/**
 * Parse arguments from the given array of strings
 * @example
 * ```js
 * const rawArgs = ['foo', '--bar', '-ac', '666', '--', '10', '11'],
 *     optionAliases = new Map([['-a', '--baz']]);
 *
 * console.log(parse(rawArgs, optionAliases));
 * // {
 * //   actions: ['foo'],
 * //   options: Map {
 * //     '--bar' => [],
 * //     '--baz' => [],
 * //     '-c' => ['666']
 * //   },
 * //   rest: ['10', '11']
 * // }
 * ```
 */
function parse(
    rawArgs: string[],
    optionAliases?: Map<string, string>
): Args;

interface ActionDefinition {
    name: string;
    help?: string;
}

interface OptionDefinition {
    name: string;
    alias?: string | null;
    value?: string;
    help?: string;
}

interface RestDefinition {
    value: string;
    help?: string;
}

type ProgramOptions = Partial<{
    title: string;
    helpInfoIndent: number;
    helpInfoGap: number;
    ignoreUnknownActions: boolean;
    ignoreUnknownOptions: boolean;
}>;

class Program {

    constructor(name: string, options?: Readonly<ProgramOptions>);

    /**
     * The name/title of the program
     * (displayed in built-in help info)
     */
    readonly name: string;
    title: string;

    /**
     * Style parameters of built-in help info
     */
    helpInfoIndent: number;
    helpInfoGap: number;

    /**
     * Whether to ignore undefined actions/options
     * (By default, undefined options will
     * cause the parsing promise to be rejected
     * but unknown actions won't)
     */
    ignoreUnknownActions: boolean;
    ignoreUnknownOptions: boolean;

    /**
     * Register a action, an option or rest options
     */
    action(definition: ActionDefinition): this;
    option(definition: OptionDefinition): this;
    rest(description: RestDefinition | null): this;

    /**
     * Parse the arguments
     * @returns a promise solved with parsed args on success
     * or rejected on unknown actions/options
     */
    parse(rawArgs: string[]): Promise<Args>;

    /**
     * Display built-in help info
     * (the help info is generated from action and
     * option definitions; you can append other help
     * info after this like the example below)
     * @example
     * ```js
     * program.parse(process.argv)
     *     .then(args => {
     *         if (args.options.has('--help')) {
     *             program.help();
     *             console.log('\nExamples');
     *             console.log('  my-cli foo --bar');
     *         } else {
     *             // ...
     *         }
     *     }, err => {
     *         // ...
     *     });
     * ```
     */
    help(): void;

}
```
