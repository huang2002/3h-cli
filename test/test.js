const CLI = require('../../3h-cli'),
    { join } = require('path');

const cli = CLI.fromJSON(join(__dirname, 'test.json')).on('error', err => {
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