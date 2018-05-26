import EventEmitter = require('events');

interface CLIArg {
    name: string;
    val?: string;
    help?: string;
    alias?: string[];
}

interface CLIProps {
    name?: string;
    title?: string;
    argArr?: CLIArg[];
    firstArg?: CLIArg;
    tabSize?: number;
    nameSize?: number;
    gapSize?: number;
    aliasGapSize?: number;
    filter?: boolean;
}

export = class CLI extends EventEmitter implements CLIProps {

    static create(options: CLIProps = {}) {
        const ans = new CLI();
        ans.set(options);
        return ans;
    }

    constructor(public name: string = '???', public title: string = '') {
        super();
    }

    private error(msg: string) {
        process.nextTick(() => {
            const err = new Error(msg);
            if (!this.emit('error', err)) {
                throw err;
            }
        });
    }

    public argArr = new Array<CLIArg>();
    public arg(arg: CLIArg) {
        if (this.argArr.some(a => a.name === arg.name)) {
            this.error(`The argument '${arg.name}' has been defined!`);
        } else {
            this.argArr.push(arg);
        }
        return this;
    }

    public firstArg?: CLIArg;
    public first(arg: CLIArg) {
        if (this.firstArg !== undefined) {
            this.error('The first argument has been defined!');
        } else {
            this.firstArg = arg;
        }
        return this;
    }

    public tabSize = 4;
    public nameSize = 10;
    public gapSize = 8;
    public aliasGapSize = 1;
    public help() {
        const { tabSize, nameSize, gapSize } = this,
            tab = ' '.repeat(tabSize),
            hasDefArgs = this.argArr.length > 0,
            firstArg = this.firstArg,
            firstArg_val = firstArg !== undefined ? firstArg.val || firstArg.name : '';

        let usage = this.name + ' ';
        if (firstArg !== undefined) {
            usage += `<${firstArg_val}>`;
        }
        if (hasDefArgs) {
            usage += ' [options]';
        }

        const helpOffset = '\n' + ' '.repeat(tabSize + nameSize + gapSize);
        let options = '';
        if (firstArg !== undefined) {
            options += '\n' + tab + `<${firstArg_val}>`.padEnd(nameSize + gapSize) +
                (firstArg.help || 'The first arg.').replace(/\n/g, helpOffset);
        }
        this.argArr.forEach(arg => {
            const { alias } = arg;
            let { name } = arg;
            if (alias) {
                const { aliasGapSize } = this;
                alias.forEach(a => {
                    name += `,${' '.repeat(aliasGapSize)}-${a}`;
                });
            }
            options += '\n' + tab + ('-' + name).padEnd(nameSize) +
                (arg.val && `<${arg.val}>` || '').padEnd(gapSize) +
                (arg.help || `"${arg.name}" arg.`).replace(/\n/g, helpOffset);
        });

        if (this.title !== undefined) {
            console.log(this.title + '\n');
        }
        console.log(usage);
        if (hasDefArgs || firstArg !== undefined) {
            console.log(options);
        }

        return this;
    }

    public filter = true;
    private parse(argv: string[]) {
        const { argArr } = this,
            aliasMap = new Map<string, string>(),
            ans = new Map<string, string[]>();

        argArr.forEach(arg => {
            const { alias } = arg;
            if (alias) {
                const { name } = arg;
                alias.forEach(a => aliasMap.set(a, name));
            }
        });

        const filter = this.filter;
        let defArgs = new Set<string>();
        if (filter) {
            argArr.forEach(a => defArgs.add(a.name));
        }

        let curArr: string[] | undefined;
        const firstArg = this.firstArg;
        argv.forEach((arg, i) => {
            const isKey = arg[0] === '-';
            if (i === 0 && firstArg !== undefined && !isKey) {
                ans.set(firstArg.name, [arg]);
            } else {
                if (isKey) {
                    const _key = arg.slice(1),
                        key = aliasMap.get(_key) || _key;
                    if (filter && !defArgs.has(key)) {
                        this.emit('extra', key);
                        curArr = undefined;
                    } else {
                        ans.set(key, curArr = new Array<string>());
                    }
                } else {
                    if (curArr !== undefined) {
                        curArr.push(arg);
                    }
                }
            }
        });

        return ans;
    }

    public set(options: CLIProps) {
        for (let prop in options) {
            if (!Reflect.has(options, prop)) {
                continue;
            }
            if (Reflect.has(this, prop)) {
                // @ts-ignore
                this[prop] = options[prop];
            } else {
                this.error(`Unknown property: '${prop}'`);
            }
        }
        return this;
    }

    public exec(rawArgv: string[]) {
        process.nextTick(() => {
            if (!this.emit('exec', this.parse(rawArgv.slice(2)))) {
                this.error("'exec' event listeners haven't been defined!");
            }
        });
        return this;
    }

}