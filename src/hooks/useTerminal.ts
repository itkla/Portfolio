import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { processTerminalCommand, getCurrentDirectory } from '@/data/terminal-commands';

export function useTerminal() {
    const t = useTranslations();
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<(string | React.ReactElement)[]>([]);
    const [currentDir, setCurrentDir] = useState(() => getCurrentDirectory());

    useEffect(() => {
        setCurrentDir(getCurrentDirectory());
    }, []);

    const executeCommand = useCallback((cmd: string) => {
        if (cmd.trim() === 'clear') {
            setHistory([]);
            setCommand('');
        } else if (cmd.trim()) {
            const promptBefore = `guest@portfolio:${getCurrentDirectory()}`;
            const output = processTerminalCommand(cmd, t);
            const newDir = getCurrentDirectory();
            
            setCurrentDir(newDir);
            setHistory((prev) => [...prev, `${promptBefore}$ ${cmd}`, output]);
            setCommand('');
        }
    }, [t]);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return {
        command,
        setCommand,
        history,
        executeCommand,
        clearHistory,
        currentDir,
    };
}
