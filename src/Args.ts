export class Args {

    constructor(
        readonly actions: string[],
        readonly options: Map<string, string[]>,
        readonly rest: string[]
    ) { }

    getOption(name: string) {
        return this.options.get(name) || [];
    }

}
