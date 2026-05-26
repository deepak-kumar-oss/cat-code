export type CommandContext = {
    exit: () => void;
}

export type Command = {
    name : String;
    description: String;
    value: String;
    action?: (ctx: CommandContext) => void | Promise<void>;
}