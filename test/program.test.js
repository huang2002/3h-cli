// @ts-check
const { Program } = require('..');

const program = new Program('3h-cli-test', {
    title: 'test program'
});

console.log('###### program test ######');

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
        name: '-a',
        value: '<val>',
        help: 'option a'
    })
    .option({
        name: '--bar',
        alias: '-b',
        help: 'option b'
    })
    .option({
        name: '--help',
        alias: '-h',
        help: 'show help info\nlike this'
    })
    .rest({
        value: '[...]',
        help: 'rest params'
    })
    .parse(process.argv)
    .then(
        args => {
            console.log('received args:', args);
            console.log('help info:\n');
            program.help();
        },
        console.error
    );
