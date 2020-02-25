// @ts-check
const { parse } = require('..');

const result = parse(
    'test cli --foo bar -ab 666 -c 1011 -- 0 1'.split(' '),
    new Map([['-c', '--baz']])
);

console.log('###### parsing result ######');
console.log(result);

console.assert(result.commands.length === 2);
console.assert(result.commands[0] === 'test');
console.assert(result.commands[1] === 'cli');
console.assert(result.options.size === 4);
console.assert(result.options.get('--foo').length === 1);
console.assert(result.options.get('--foo')[0] === 'bar');
console.assert(result.options.get('-a').length === 0);
console.assert(result.options.get('--baz').length === 1);
console.assert(result.options.get('--baz')[0] === '1011');
console.assert(result.rest.length === 2);
console.assert(result.rest[0] === '0');
console.assert(result.rest[1] === '1');
