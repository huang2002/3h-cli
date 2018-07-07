"use strict";
const EventEmitter = require("events");
const fs = require("fs");
class CLI extends EventEmitter {
    constructor(name = '???', title = '') {
        super();
        this.name = name;
        this.title = title;
        this.argArr = new Array();
        this.tabSize = 4;
        this.nameSize = 10;
        this.gapSize = 8;
        this.aliasGapSize = 1;
        this.lineGapSize = 0;
        this.filter = true;
    }
    static create(options = {}) {
        const ans = new CLI();
        ans.set(options);
        return ans;
    }
    static fromJSON(file, encoding = 'utf8') {
        return CLI.create(JSON.parse(fs.readFileSync(file, encoding)));
    }
    error(msg) {
        process.nextTick(() => {
            const err = new Error(msg);
            if (!this.emit('error', err)) {
                throw err;
            }
        });
    }
    arg(arg) {
        if (this.argArr.some(a => a.name === arg.name)) {
            this.error(`The argument '${arg.name}' has been defined!`);
        }
        else {
            this.argArr.push(arg);
        }
        return this;
    }
    args(args) {
        args.forEach(arg => {
            this.arg(arg);
        });
        return this;
    }
    first(arg) {
        if (this.firstArg !== undefined) {
            this.error('The first argument has been defined!');
        }
        else {
            this.firstArg = arg;
        }
        return this;
    }
    help() {
        const { tabSize, nameSize, gapSize, lineGapSize, argArr, firstArg } = this, { length } = argArr, hasDefArgs = length > 0, tab = ' '.repeat(tabSize), lineGap = '\n'.repeat(lineGapSize), firstArg_val = firstArg !== undefined ? firstArg.val || firstArg.name : '';
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
        argArr.forEach((arg, i) => {
            if (!(i === 0 && firstArg === undefined)) {
                options += lineGap;
            }
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
    parse(argv) {
        const { argArr } = this, aliasMap = new Map(), ans = new Map();
        argArr.forEach(arg => {
            const { alias } = arg;
            if (alias) {
                const { name } = arg;
                alias.forEach(a => aliasMap.set(a, name));
            }
        });
        const filter = this.filter;
        let defArgs = new Set();
        if (filter) {
            argArr.forEach(a => defArgs.add(a.name));
        }
        const firstArg = this.firstArg;
        let curArr, flag = firstArg !== undefined;
        argv.forEach((arg, i) => {
            const isKey = arg[0] === '-';
            if (flag && !isKey) {
                ans.set(firstArg.name, curArr = [arg]);
                flag = false;
            }
            else {
                if (isKey) {
                    const _key = arg.slice(1), key = aliasMap.get(_key) || _key;
                    if (filter && !defArgs.has(key)) {
                        this.emit('extra', key);
                        curArr = undefined;
                    }
                    else {
                        ans.set(key, curArr = []);
                    }
                    if (i === 0) {
                        flag = false;
                    }
                }
                else {
                    if (curArr !== undefined) {
                        curArr.push(arg);
                    }
                }
            }
        });
        return ans;
    }
    set(options) {
        for (let prop in options) {
            if (!Reflect.has(options, prop)) {
                continue;
            }
            if (Reflect.has(this, prop)) {
                // @ts-ignore
                this[prop] = options[prop];
            }
            else {
                this.error(`Unknown property: '${prop}'`);
            }
        }
        return this;
    }
    exec(rawArgv) {
        process.nextTick(() => {
            if (!this.emit('exec', this.parse(rawArgv.slice(2)))) {
                this.error("'exec' event listeners haven't been defined!");
            }
        });
        return this;
    }
}
module.exports = CLI;
