/// <reference types="node" />
import EventEmitter = require('events');
export interface CLIArg {
    name: string;
    val?: string;
    help?: string;
    alias?: string[];
}
export interface CLIProps {
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
declare const _default: {
    new (public name?: string, public title?: string): {
        name: string;
        title: string;
        error(msg: string): void;
        argArr: CLIArg[];
        arg(arg: CLIArg): any;
        firstArg?: CLIArg | undefined;
        first(arg: CLIArg): any;
        tabSize: number;
        nameSize: number;
        gapSize: number;
        aliasGapSize: number;
        help(): any;
        filter: boolean;
        parse(argv: string[]): Map<string, string[]>;
        set(options: CLIProps): any;
        exec(rawArgv: string[]): any;
        addListener(event: string | symbol, listener: (...args: any[]) => void): any;
        on(event: string | symbol, listener: (...args: any[]) => void): any;
        once(event: string | symbol, listener: (...args: any[]) => void): any;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
        removeAllListeners(event?: string | symbol | undefined): any;
        setMaxListeners(n: number): any;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(type: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
        eventNames(): (string | symbol)[];
    };
    create(options?: CLIProps): {
        name: string;
        title: string;
        error(msg: string): void;
        argArr: CLIArg[];
        arg(arg: CLIArg): any;
        firstArg?: CLIArg | undefined;
        first(arg: CLIArg): any;
        tabSize: number;
        nameSize: number;
        gapSize: number;
        aliasGapSize: number;
        help(): any;
        filter: boolean;
        parse(argv: string[]): Map<string, string[]>;
        set(options: CLIProps): any;
        exec(rawArgv: string[]): any;
        addListener(event: string | symbol, listener: (...args: any[]) => void): any;
        on(event: string | symbol, listener: (...args: any[]) => void): any;
        once(event: string | symbol, listener: (...args: any[]) => void): any;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
        removeAllListeners(event?: string | symbol | undefined): any;
        setMaxListeners(n: number): any;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(type: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
        eventNames(): (string | symbol)[];
    };
    EventEmitter: typeof EventEmitter.EventEmitter;
};
export = _default;
