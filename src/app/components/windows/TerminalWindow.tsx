"use client";

import React, { useCallback, useMemo } from "react";

interface TerminalWindowProps {
    command: string;
    setCommand: (cmd: string) => void;
    history: (string | React.ReactElement)[];
    onExecuteCommand: (cmd: string) => void;
    currentDir: string;
}

export function TerminalWindow({
    command,
    setCommand,
    history,
    onExecuteCommand,
    currentDir
}: TerminalWindowProps) {
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onExecuteCommand(command);
        }
    }, [command, onExecuteCommand]);

    const prompt = useMemo(() => `guest@portfolio:${currentDir}$`, [currentDir]);

    return (
        <div className="p-4 text-green-400 font-mono h-full overflow-auto">
            {history.map((item, idx) =>
                React.isValidElement(item) ? (
                    <React.Fragment key={idx}>{item}</React.Fragment>
                ) : (
                    <p key={idx} className="whitespace-pre-wrap">{item}</p>
                )
            )}
            <div className="flex gap-1">
                <span>{prompt}</span>
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent text-green-400 outline-none flex-1"
                    autoFocus
                />
            </div>
        </div>
    );
}
