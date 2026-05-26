import type { Command } from "./types";

export const COMMANDS: Command[] = [
    {
        name: "new",
        description: "start a new conversation",
        value: "/new"
    },
    {
        name: "agents",
        description: "browse AI agents",
        value: "/agents",
    },
    {
        name: "model",
        description:  "select AI model to use",
        value: "/models",
    },
    {
        name: "sessions",
        description: "browse past sessions",
        value: "/sessions",
    },
    {
        name: "theme",
        description: "change application theme",
        value: "/theme",
    },
    {
        name:"login",
        description: "sign in to your account",
        value: "/login",
    },
    {
        name : "logout",
        description: "sign out of your account",
        value: "/logout",
    },
    {
        name: "upgrade",
        description: "buy more credits",
        value : "/upgrade",
    },
    {
        name: "usage",
        description: "open billing portal in browser",
        value: "/usage",
    },
    {
        name: "exit",
        description: "exit the application",
        value: "/exit",
        action: (ctx) => {
            ctx.exit();
        }
    }
];
