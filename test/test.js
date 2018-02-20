const CLI = require('../js/3h-cli');

const cli = CLI.create({
    name: 'test.js',
    title: 'Here is the test script.'
}).set({
    nameSize: 4,
    tabSize: 3
}).first({
    name: 'first',
    val: '1st',
    help: 'The first arg.'
}).arg({
    name: 'a',
    val: 'v1',
    help: 'a -> v1'
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