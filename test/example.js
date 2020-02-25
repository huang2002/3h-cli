#!/usr/bin/env node
const { Program } = require('..');
// const { Program } = require('3h-cli');

const program = new Program('my-cli');

program
    .command({
        name: 'foo',
        help: 'command foo'
    })
    .command({
        name: 'bar',
        help: 'command bar'
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
        console.log('received commands:', args.commands);
        console.log('received options:', args.options);
        console.log('other args:', args.rest);
        if (args.options.has('--help')) {
            return program.help();
        }
    }, err => {
        console.error(err);
        process.exit(1);
    });
