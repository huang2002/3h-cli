export interface ParsedArgs {
    commands: string[];
    options: Map<string, string[]>;
    rest: string[];
}

export const parse = (
    rawArgs: string[],
    optionAliases?: Map<string, string>
): ParsedArgs => {

    const commands = new Array<string>(),
        options = new Map<string, string[]>(),
        rest = new Array<string>();

    let stack = commands;

    const initParam = (name: string) => {
        const key = (optionAliases && optionAliases.has(name))
            ? optionAliases.get(name)!
            : name;
        options.set(key, stack = []);
    };

    rawArgs.forEach(arg => {

        if (stack === rest) {
            return stack.push(arg);
        }

        if (arg[0] !== '-') {
            return stack.push(arg);
        }

        const equalIndex = arg.indexOf('=');

        if (arg[1] === '-') { // --foo
            if (arg.length === 2) { // --
                return stack = rest;
            }
            if (~equalIndex) {
                initParam(arg.slice(0, equalIndex));
            } else {
                initParam(arg);
            }
        } else { // -abc
            const endIndex = ~equalIndex
                ? equalIndex
                : arg.length;
            for (let i = 1; i < endIndex; i++) {
                initParam('-' + arg[i]);
            }
        }

        if (~equalIndex) {
            stack.push(arg.slice(equalIndex + 1));
        }

    });

    return { commands, options, rest };

};