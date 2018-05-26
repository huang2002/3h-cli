const CLI = require('../../3h-cli');

const cli = CLI.create({
    name: 'test.js',
    title: 'Here is the test script.',
    lineGapSize: 1
}).set({
    nameSize: 10,
    tabSize: 3
}).first({
    name: 'first',
    val: '1st',
    help: 'The\n first\n  arg.'
}).arg({
    name: 'a',
    val: 'v1',
    help: 'a -> v1',
    alias: ['aa']
}).arg({
    name: 'b'
}).on('error', err => {
    console.log('!ERROR');
    console.error(err);
}).on('extra', key => {
    console.log(`Unknown arg: '${key}'`);
}).on('exec', args => {
    console.log('[Arguments]');
    args.forEach((v, k) => {
        console.log(`${k}->${JSON.stringify(v)}`);
    });
    console.log('[HELP]');
    cli.help();
}).exec(process.argv);