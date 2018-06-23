/// <reference types="node" />
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
    lineGapSize?: number;
    filter?: boolean;
}
declare class CLI extends EventEmitter implements CLIProps {
    static create(options?: CLIProps): CLI;
    name: string;
    title: string;
    constructor(name?: string, title?: string);
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'extra', listener: (extraArg: string) => void): this;
    on(event: 'exec', listener: (args: Map<string, string[]>) => void): this;
    error(msg: string): void;
    argArr: CLIArg[];
    arg(arg: CLIArg): this;
    firstArg?: CLIArg;
    first(arg: CLIArg): this;
    tabSize: number;
    nameSize: number;
    gapSize: number;
    aliasGapSize: number;
    lineGapSize: number;
    help(): this;
    filter: boolean;
    parse(argv: string[]): Map<string, string[]>;
    set(options: CLIProps): this;
    exec(rawArgv: string[]): this;
}
export = CLI;
