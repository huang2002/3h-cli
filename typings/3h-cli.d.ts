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
interface CLI {
    emit(event: 'error', err: Error): boolean;
    on(event: 'error', listener: (err: Error) => void): this;
    emit(event: 'extra', extraArg: string): boolean;
    on(event: 'extra', listener: (extraArg: string) => void): this;
    emit(event: 'exec', args: Map<string, string[]>): boolean;
    on(event: 'exec', listener: (args: Map<string, string[]>) => void): this;
}
declare class CLI extends EventEmitter implements CLIProps {
    name: string;
    title: string;
    constructor(name?: string, title?: string);
    static create(options?: CLIProps): CLI;
    static fromJSON(file: string, encoding?: string): CLI;
    error(msg: string): void;
    argArr: CLIArg[];
    arg(arg: CLIArg): this;
    args(args: CLIArg[]): this;
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
