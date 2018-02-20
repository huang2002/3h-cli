import EventEmitter from 'events';

interface CLIArg {
    name: string;
    val?: string;
    help?: string;
}

interface CLIProps {
    name?: string;
    title?: string;
    argArr?: CLIArg[];
    firstArg?: CLIArg;
    tabSize?: number;
    nameSize?: number;
    gapSize?: number;
    filter?: boolean;
}

export default class CLI extends EventEmitter implements CLIProps {

    static create(options?: CLIProps): CLI;

    constructor(name?: string, title?: string);

    public name: string;
    public title?: string;
    public argArr: CLIArg[];
    public firstArg?: CLIArg;
    public tabSize: number;
    public nameSize: number;
    public gapSize: number;
    public filter: boolean;

    public help(): this;
    public arg(arg: CLIArg): this;
    public first(arg: CLIArg): this;
    public set(options: CLIProps): this;
    public exec(rawArgv: string[]): this;

    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'extra', listener: (key: string) => void): this;
    on(event: 'exec', listener: (args: Map<string, string[]>) => void): this;

}