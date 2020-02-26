import { parse } from './parser';

export interface CommandDefinition {
    name: string;
    help?: string;
}

export interface OptionDefinition {
    name: string;
    alias?: string | null;
    value?: string;
    help?: string;
}

export interface RestDefinition {
    value?: string;
    help?: string;
}

export type ProgramOptions = Partial<{
    title: string;
    helpInfoIndent: number;
    helpInfoGap: number;
    ignoreUnknownCommands: boolean;
    ignoreUnknownOptions: boolean;
}>;

export class Program implements Required<ProgramOptions> {

    constructor(readonly name: string, options?: Readonly<ProgramOptions>) {
        if (options) {
            Object.assign(this, options);
        }
    }

    title = '';
    helpInfoIndent = 2;
    helpInfoGap = 5;
    ignoreUnknownCommands = false;
    ignoreUnknownOptions = false;
    private _commands = new Array<CommandDefinition>();
    private _options = new Array<OptionDefinition>();
    private _rest: RestDefinition | null = null;

    command(definition: CommandDefinition) {
        this._commands.push(definition);
        return this;
    }

    option(definition: OptionDefinition) {
        this._options.push(definition);
        return this;
    }

    rest(description: RestDefinition | null) {
        this._rest = description;
        return this;
    }

    async parse(rawArgs: string[]) {
        const { _commands, _options } = this,
            aliases = new Map<string, string>();
        _options.forEach(param => {
            if (param.alias) {
                aliases.set(param.alias, param.name);
            }
        });
        const args = parse(rawArgs.slice(2), aliases);
        if (!this.ignoreUnknownCommands) {
            args.commands.forEach(command => {
                if (!_commands.some(cmd => cmd.name === command)) {
                    throw `unknown command -- ${command}`;
                }
            });
        }
        if (!this.ignoreUnknownOptions) {
            args.options.forEach((_, key) => {
                if (!_options.some(param => param.name === key || param.alias === key)) {
                    throw `unknown param -- ${key}`;
                }
            });
        }
        return args;
    }

    help() {

        const { _commands, _options, _rest } = this,
            eolPattern = /(?:\r)?\n/g;

        let definitionWidth = 2;
        _commands.forEach(command => {
            const width = command.name.length;
            if (width > definitionWidth) {
                definitionWidth = width;
            }
        });
        _options.forEach(param => {
            let width = param.name.length;
            if (param.alias) {
                width += param.alias.length + 2; // `, ${alias}`
            }
            if (param.value) {
                width += param.value.length + 1; // ` ${value}`
            }
            if (width > definitionWidth) {
                definitionWidth = width;
            }
        });
        if (_rest) {
            const restWidth = _rest.value
                ? _rest.value.length + 3 // `-- ${value}`
                : 2;
            if (definitionWidth < restWidth) {
                definitionWidth = restWidth;
            }
        }
        definitionWidth += this.helpInfoGap;

        const startIndent = ' '.repeat(this.helpInfoIndent),
            helpIndent = startIndent + ' '.repeat(definitionWidth),
            helpEOL = '\n' + helpIndent;

        let usage = `${this.name}`;
        if (_commands.length) {
            usage += ' <command>';
        }
        if (_options.length) {
            usage += ' [options]';
        }
        if (_rest) {
            usage += ' -- ' + _rest.value;
        }

        if (this.title) {
            console.log(this.title);
        }

        console.log('\nUsage:');
        console.log(startIndent + usage);

        if (_commands.length) {
            console.log('\nCommands:');
            _commands.forEach(command => {
                console.log(
                    startIndent
                    + command.name.padEnd(definitionWidth)
                    + (command.help && command.help.replace(eolPattern, helpEOL))
                );
            });
        }

        if (_options.length || _rest) {
            console.log('\nOptions:');
        }

        if (_options.length) {
            _options.forEach(param => {
                let name = param.name;
                if (param.alias) {
                    name += ', ' + param.alias;
                }
                if (param.value) {
                    name += ' ' + param.value;
                }
                console.log(
                    startIndent
                    + name.padEnd(definitionWidth)
                    + (param.help && param.help.replace(eolPattern, helpEOL))
                );
            });
        }

        if (_rest) {
            console.log(
                startIndent
                + `-- ${_rest.value}`.padEnd(definitionWidth)
                + _rest.help
            );
        }

    }

}
