import { KeyBinding } from "@opentui/core";
import { StatusBar } from "./status-bar";
import { EmptyBorder } from "./border";
import { CommandMenu } from "./command-menu";
import {useRef , useState , useCallback , useEffect } from "react";
import { TextareaRenderable } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { useCommandMenu } from "./command-menu/use-command-menu";
import { Command } from "./command-menu/types";

type props = {
    onSubmit: (text: string) => void;
    disable?: boolean;
}

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
    {name: "return", action: "submit"},
    {name: "enter", action: "submit"},
    {name: "return", ctrl: true, action: "newline"},
    {name: "enter", ctrl: true, action: "newline"},
]

export function InputBar({onSubmit, disable = false}: props) { 
    const textareaRef = useRef<TextareaRenderable>(null);
    const onSubmitRef = useRef<() => void>(() => {})
    const renderer = useRenderer();

    const {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollBoxRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,
    } = useCommandMenu();


    const handleCommandExecute = useCallback((index : number) => {
        const command = resolveCommand(index);
        handleCommand(command);
    } , [])

    const handleTextareaContentChange = useCallback(() => {
        const textarea = textareaRef.current;
        if(!textarea) return;

        handleContentChange(textarea.plainText);


    }, [])

    const handleSubmit = useCallback(() => {
        if(disable) return;
        const textarea = textareaRef.current;
        if(!textarea) return;
        const text = textarea.plainText.trim();
        if(text.length === 0) return;

        onSubmit(text);
        textarea.setText(" ");
    } , [disable , onSubmit])

    const handleCommand = useCallback((
        command: Command | undefined
    ) => {
        const textarea = textareaRef.current;
        if(!textarea || !command) return;
        textarea.setText("");
        if(command.action){
            command.action({
                exit: () => renderer.destroy(),
            })
        }
        else{
            textarea.insertText(command.value + " ");
        }
    }, [renderer])


    useEffect(()=> {
        const textarea = textareaRef.current;
        if(!textarea) return;
        textarea.onSubmit = () => {
            onSubmitRef.current();
        };

    } , []);

    onSubmitRef.current = () => {
        if(disable) return;
        if(showCommandMenu){
            const command = resolveCommand(selectedIndex);
            handleCommand(command);
            return;
        }
        handleSubmit();
    }

    return (
        <box width="100%" alignItems="center" >
            <box
                border={["left"]}
                borderColor="cyan"
                width="100%"
                customBorderChars={{
                    ...EmptyBorder,
                    vertical: "┃",
                    bottomLeft: "╹"
                }}
            >
                <box position="relative" width="100%" paddingX={2} paddingY={1} backgroundColor="#1A1A24" gap={1}>
                    {showCommandMenu && (
                        <box
                            position="absolute"
                            bottom="100%"
                            left={0}
                            width="100%"
                            backgroundColor="#1A1A24"
                            zIndex={1}
                        >
                            <CommandMenu
                                query={commandQuery}
                                selectedIndex={selectedIndex}
                                scrollBoxRef={scrollBoxRef}
                                onSelect={setSelectedIndex}
                                onExecute={handleCommandExecute}
                            />

                        </box>
                    )}
                    <textarea 
                        focused={!disable}
                        keyBindings={TEXTAREA_KEY_BINDINGS}
                        onContentChange={handleTextareaContentChange}
                        ref={textareaRef}
                        placeholder={`Type your message here...`}
                    />
                    <StatusBar />
                </box>
            </box>
        </box>
    )
}