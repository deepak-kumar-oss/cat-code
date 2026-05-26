import {useRef , useState , useMemo , type RefObject} from "react";
import {ScrollBoxRenderable} from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { getFilteredCommands } from "./filter-commands";
import { COMMANDS } from "./commands";
import type {Command} from "./types";


type useCommandMenuReturn = {
    showCommandMenu: boolean;
    commandQuery: string;
    selectedIndex: number;
    scrollBoxRef: RefObject<ScrollBoxRenderable | null>;
    handleContentChange: (text: string) => void;
    resolveCommand: (index : number) => Command | undefined;
    setSelectedIndex: (index: number) => void;
}

export function useCommandMenu(): useCommandMenuReturn {
    const [textValue, setTextValue] = useState("");
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollBoxRef = useRef<ScrollBoxRenderable | null>(null);

    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

    const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery]);

    const handleContentChange = (text: string) => {
        setTextValue(text);
        setSelectedIndex(0);

        const scrollBox = scrollBoxRef.current;
        if(scrollBox){
            scrollBox.scrollTo(0);
        }
        const prefix = text.startsWith('/') ? text.slice(1) : null;
        if(prefix !== null && !prefix.includes(" ")){
            setShowCommandMenu(true);
        }else{
            setShowCommandMenu(false);
        }
    }


    const resolveCommand = (index: number): Command | undefined => {
        const cmd = filteredCommands[index];
        if(cmd){
            setShowCommandMenu(false);  
        }
        return cmd;
    }       
    
    useKeyboard((key) => {
        if(!showCommandMenu) return;

        if(key.name === "escape"){
            key.preventDefault();
            setShowCommandMenu(false);
        }else if(key.name === "up"){
            key.preventDefault();
            setSelectedIndex((i : number) => {
                const newIndex = Math.max(0, i - 1);
                const scrollbar  = scrollBoxRef.current;
                if(scrollbar && newIndex < scrollbar.scrollTop){
                    scrollbar.scrollTo(newIndex);
                }
                return newIndex;
            })
        } else if(key.name === "down"){
            key.preventDefault();
            setSelectedIndex((i: number) => {
                if (filteredCommands.length === 0)  return 0;
                const newIndex = Math.min(filteredCommands.length - 1 , i + 1);
                const scrollbar = scrollBoxRef.current;
                if(scrollbar){
                    const viewportHeight = scrollbar.viewport.height;
                    const visibleEnd = scrollbar.scrollTop + viewportHeight - 1;
                    if(newIndex > visibleEnd){
                        scrollbar.scrollTo(newIndex - viewportHeight + 1)
                    }
                }
                return newIndex;
            })
        }
    }) 

    return {
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollBoxRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex
    }
}