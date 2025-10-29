import { TerminalCommand } from './types';

const DEFAULT_FILE_SYSTEM: Record<string, string[]> = {
    '/home/guest': ['profile.txt', 'about.txt', 'projects.txt', 'skills.txt'],
    '/home/guest/projects': ['checkpoint', 'portfolio', 'boulangerie'],
    '/home/guest/documents': ['resume.pdf', 'notes.md'],
};

const DEFAULT_DIRECTORY = '/home/guest';
const FS_STORAGE_KEY = 'terminal_filesystem';
const DIR_STORAGE_KEY = 'terminal_current_dir';

const loadFileSystem = (): Record<string, string[]> => {
    if (typeof window === 'undefined') return { ...DEFAULT_FILE_SYSTEM };
    
    try {
        const stored = localStorage.getItem(FS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load filesystem from localStorage:', error);
    }
    return { ...DEFAULT_FILE_SYSTEM };
};

const loadCurrentDirectory = (): string => {
    if (typeof window === 'undefined') return DEFAULT_DIRECTORY;
    
    try {
        const stored = localStorage.getItem(DIR_STORAGE_KEY);
        if (stored) {
            return stored;
        }
    } catch (error) {
        console.error('Failed to load current directory from localStorage:', error);
    }
    return DEFAULT_DIRECTORY;
};

const saveFileSystem = (fs: Record<string, string[]>) => {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(fs));
    } catch (error) {
        console.error('Failed to save filesystem to localStorage:', error);
    }
};

const saveCurrentDirectory = (dir: string) => {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem(DIR_STORAGE_KEY, dir);
    } catch (error) {
        console.error('Failed to save current directory to localStorage:', error);
    }
};

export const resetFileSystem = () => {
    fileSystem = { ...DEFAULT_FILE_SYSTEM };
    currentDirectory = DEFAULT_DIRECTORY;
    saveFileSystem(fileSystem);
    saveCurrentDirectory(currentDirectory);
};

let currentDirectory = loadCurrentDirectory();
let fileSystem = loadFileSystem();

export const getCurrentDirectory = () => currentDirectory;

export const terminalCommands: Record<string, TerminalCommand> = {
    help: {
        command: 'help',
        outputKey: 'terminal.help',
    },
    ping: {
        command: 'ping',
        outputKey: 'terminal.ping',
    },
    clear: {
        command: 'clear',
        output: '',
    },
    whoami: {
        command: 'whoami',
        outputKey: 'terminal.whoami',
    },
    date: {
        command: 'date',
        output: () => new Date().toString(),
    },
    time: {
        command: 'time',
        output: () => new Date().toLocaleTimeString(),
    },
    pwd: {
        command: 'pwd',
        output: () => currentDirectory,
    },
    hostname: {
        command: 'hostname',
        output: 'portfolio.local',
    },
    uname: {
        command: 'uname',
        output: 'Linux',
    },
    'uname -a': {
        command: 'uname -a',
        output: 'Linux portfolio 6.1.0-portfolio #1 SMP x86_64 GNU/Linux',
    },
    uptime: {
        command: 'uptime',
        output: () => {
            const startTime = Date.now();
            return `up ${Math.floor((Date.now() - startTime) / 1000)} seconds, 1 user`;
        },
    },
    ls: {
        command: 'ls',
        output: () => fileSystem[currentDirectory]?.join('  ') || '',
    },
    'ls -la': {
        command: 'ls -la',
        output: () => {
            const files = fileSystem[currentDirectory] || [];
            const lines = [
                'total 0',
                'drwxr-xr-x  2 guest guest 4096 Jan 15 12:00 .',
                'drwxr-xr-x  3 root  root  4096 Jan 15 12:00 ..',
            ];
            files.forEach(file => {
                const isDir = fileSystem[`${currentDirectory}/${file}`];
                const prefix = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
                lines.push(`${prefix}  1 guest guest  0 Jan 15 12:00 ${file}`);
            });
            return lines.join('\n');
        },
    },
    'ls -l': {
        command: 'ls -l',
        output: () => {
            const files = fileSystem[currentDirectory] || [];
            const lines = ['total 0'];
            files.forEach(file => {
                const isDir = fileSystem[`${currentDirectory}/${file}`];
                const prefix = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
                lines.push(`${prefix}  1 guest guest  0 Jan 15 12:00 ${file}`);
            });
            return lines.join('\n');
        },
    },
    'cat profile.txt': {
        command: 'cat profile.txt',
        outputKey: 'terminal.profileOutput',
    },
    'cat about.txt': {
        command: 'cat about.txt',
        outputKey: 'terminal.aboutOutput',
    },
    'cat projects.txt': {
        command: 'cat projects.txt',
        outputKey: 'terminal.projectsOutput',
    },
    'cat skills.txt': {
        command: 'cat skills.txt',
        output: 'Languages: TypeScript, JavaScript, Go, Python, Rust, C++\nFrameworks: React, Next.js, Node.js\nTools: Git, Docker, PostgreSQL, Redis',
    },
    env: {
        command: 'env',
        output: 'USER=guest\nHOME=/home/guest\nSHELL=/bin/bash\nPATH=/usr/local/bin:/usr/bin:/bin\nLANG=en_US.UTF-8',
    },
    history: {
        command: 'history',
        output: 'Command history is tracked in the terminal above.',
    },
    crypto: {
        command: 'crypto',
        output: 'btc eth usdc doge',
    },
    'crypto btc': {
        command: 'crypto btc',
        output: '3Kme8iqa7vfPXovpTTSvKjeAD3comiEHNK',
    },
    'crypto eth': {
        command: 'crypto eth',
        output: '0xDB353e0701381BF45383000Ee9062C83D3934665',
    },
    'crypto usdc': {
        command: 'crypto usdc',
        output: '(usdc/eth) 0xAF68234be3882e482cc809987975294Ad1AB5c24',
    },
    'crypto doge': {
        command: 'crypto doge',
        output: 'DQZ4fhAHpMCvqnNRSFwEoQ4bmEskX9bXej',
    },
};

export const processTerminalCommand = (
    cmd: string,
    t: (key: string) => string
): string => {
    const trimmed = cmd.trim();
    if (!trimmed) return '';

    if (terminalCommands[trimmed]) {
        const command = terminalCommands[trimmed];
        if (command.outputKey) {
            return t(command.outputKey);
        }
        if (typeof command.output === 'function') {
            return command.output();
        }
        return command.output || '';
    }

    if (trimmed.startsWith('cd ')) {
        const target = trimmed.slice(3).trim();
        if (target === '..') {
            const parts = currentDirectory.split('/').filter(Boolean);
            if (parts.length > 2) {
                parts.pop();
                currentDirectory = '/' + parts.join('/');
            } else {
                currentDirectory = '/home/guest';
            }
            saveCurrentDirectory(currentDirectory);
            return '';
        } else if (target === '~' || target === '') {
            currentDirectory = '/home/guest';
            saveCurrentDirectory(currentDirectory);
            return '';
        } else if (target.startsWith('/')) {
            if (fileSystem[target]) {
                currentDirectory = target;
                saveCurrentDirectory(currentDirectory);
                return '';
            }
            return `cd: ${target}: No such file or directory`;
        } else {
            const newPath = `${currentDirectory}/${target}`;
            if (fileSystem[newPath]) {
                currentDirectory = newPath;
                saveCurrentDirectory(currentDirectory);
                return '';
            }
            return `cd: ${target}: No such file or directory`;
        }
    }

    if (trimmed.startsWith('mkdir ')) {
        const dirName = trimmed.slice(6).trim();
        if (!dirName) {
            return 'mkdir: missing operand';
        }
        const newPath = `${currentDirectory}/${dirName}`;
        if (fileSystem[newPath]) {
            return `mkdir: cannot create directory '${dirName}': File exists`;
        }
        fileSystem[newPath] = [];
        if (!fileSystem[currentDirectory].includes(dirName)) {
            fileSystem[currentDirectory].push(dirName);
        }
        saveFileSystem(fileSystem);
        return '';
    }

    if (trimmed.startsWith('touch ')) {
        const fileName = trimmed.slice(6).trim();
        if (!fileName) {
            return 'touch: missing file operand';
        }
        if (!fileSystem[currentDirectory].includes(fileName)) {
            fileSystem[currentDirectory].push(fileName);
        }
        saveFileSystem(fileSystem);
        return '';
    }

    if (trimmed.startsWith('rm ')) {
        const fileName = trimmed.slice(3).trim();
        if (!fileName) {
            return 'rm: missing operand';
        }
        const index = fileSystem[currentDirectory].indexOf(fileName);
        if (index === -1) {
            return `rm: cannot remove '${fileName}': No such file or directory`;
        }
        fileSystem[currentDirectory].splice(index, 1);
        saveFileSystem(fileSystem);
        return '';
    }

    if (trimmed.startsWith('man ')) {
        const manCmd = trimmed.slice(4).trim();
        const manPages: Record<string, string> = {
            ls: 'ls - list directory contents\nUsage: ls [OPTION]...\n  -l  use a long listing format\n  -a  do not ignore entries starting with .',
            cd: 'cd - change directory\nUsage: cd [DIRECTORY]\n  ..  move up one directory\n  ~   move to home directory',
            pwd: 'pwd - print working directory\nUsage: pwd\nPrints the current working directory',
            cat: 'cat - concatenate files and print\nUsage: cat [FILE]...\nConcatenate FILE(s) to standard output',
            echo: 'echo - display a line of text\nUsage: echo [STRING]...\nEcho the STRING(s) to standard output',
            mkdir: 'mkdir - make directories\nUsage: mkdir DIRECTORY...\nCreate the DIRECTORY(ies)',
            rm: 'rm - remove files or directories\nUsage: rm [FILE]...\nRemove (unlink) the FILE(s)',
            touch: 'touch - change file timestamps\nUsage: touch FILE...\nCreate empty FILE(s) or update timestamps',
            help: 'help - display available commands\nUsage: help\nShow a list of available terminal commands',
            whoami: 'whoami - print effective username\nUsage: whoami\nPrint the user name',
            reset: 'reset - reset filesystem to defaults\nUsage: reset\nRestores the filesystem to its original state',
        };
        return manPages[manCmd] || `No manual entry for ${manCmd}`;
    }

    if (trimmed.startsWith('login admin')) {
        const password = trimmed.slice(12).trim();
        if (password === 'password') {
            return t('terminal.welcomeAdmin');
        }
        return t('terminal.incorrectPassword');
    }

    if (trimmed === 'reset') {
        resetFileSystem();
        return 'Filesystem reset to defaults.';
    }

    if (trimmed.startsWith('echo ')) {
        return trimmed.slice(5);
    }

    if (trimmed.startsWith('cat ')) {
        const fileName = trimmed.slice(4).trim();
        if (fileSystem[currentDirectory].includes(fileName)) {
            return `${fileName}: This is a placeholder file.`;
        }
        return t('terminal.fileNotFound');
    }

    return t('terminal.unknownCommand');
};
