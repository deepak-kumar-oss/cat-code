import {RefObject} from "react";
import {TextAttributes , type ScrollBoxRenderable} from "@opentui/core";
import { getFilteredCommands } from "./filter-commands";
import { COMMANDS } from "./commands";

const MAX_VISIBLE_COMMANDS = 8;

const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map(cmd => cmd.name.length)) + 4;

type CommandMenuProps = {
    query: string;
    selectedIndex: number;
    scrollBoxRef: RefObject<ScrollBoxRenderable | null>;
    onSelect: (index: number) => void;
    onExecute: (index: number) => void;
};

export function CommandMenu({query, selectedIndex, scrollBoxRef, onSelect, onExecute}: CommandMenuProps) {
    const filteredCommands = getFilteredCommands(query);
    const visibleCommands = Math.min(filteredCommands.length, MAX_VISIBLE_COMMANDS);
    if(filteredCommands.length === 0){
        return (
            <box paddingX={1}>
                <text attributes={TextAttributes.DIM}>No commands found</text>
            </box>
        )
    }
    return (
        <scrollbox ref={scrollBoxRef} height={visibleCommands} width="100%">
            {
                filteredCommands.map((cmd, index) => {
                    const isSelected = index === selectedIndex; 
                    return (
                        <box
                            key={String(cmd.name)}
                            flexDirection="row"
                            height={1}
                            overflow="hidden"
                            paddingX={1}
                            backgroundColor={isSelected ? "cyan" : undefined}
                            onMouseDown={() => onExecute(index)} 
                            onMouseMove={() => onSelect(index)}
                        >
                            <box width={COMMAND_COL_WIDTH} flexShrink={1} paddingRight={2} >
                                <text selectable={false} fg={isSelected ? "black" : "white"}>/{cmd.name}</text>
                            </box>

                            <box flexShrink={1} paddingLeft={2} overflow="hidden">
                                <text selectable={false} attributes={TextAttributes.DIM} fg={isSelected ? "black" : "gray"}>{cmd.description}</text>
                            </box>

                        </box>
                    )
                })
            }
        </scrollbox>
    )
}
