import { useEffect, useCallback } from 'react';
import type { WindowId } from '@/constants/windows';
import { WINDOW_IDS } from '@/constants/windows';

export interface KeyboardShortcutHandlers {
    openWindow: (id: WindowId) => void;
    closeWindow: (id: WindowId) => void;
    toggleMinimize: (id: WindowId) => void;
    bringToFront: (id: WindowId) => void;
    getOpenWindows: () => Array<{ id: WindowId; zIndex: number }>;
}

/**
 * Custom hook for handling keyboard shortcuts
 *
 * Shortcuts:
 * - Cmd/Ctrl + W: Close focused/top window
 * - Cmd/Ctrl + T: Open terminal
 * - Cmd/Ctrl + A: Open about window
 * - Cmd/Ctrl + P: Open profile window
 * - Cmd/Ctrl + M: Minimize focused/top window
 * - Escape: Close focused/top window
 * - Cmd/Ctrl + 1-9: Focus window by position
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
    const {
        openWindow,
        closeWindow,
        toggleMinimize,
        bringToFront,
        getOpenWindows,
    } = handlers;

    const getTopWindow = useCallback(() => {
        const openWindows = getOpenWindows();
        if (openWindows.length === 0) return null;
        return openWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
    }, [getOpenWindows]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInputField =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

        const isMod = e.metaKey || e.ctrlKey;

        if (e.key === 'Escape') {
            const topWindow = getTopWindow();
            if (topWindow) {
                e.preventDefault();
                closeWindow(topWindow.id);
            }
            return;
        }

        if (isInputField && e.key !== 'Escape') {
            return;
        }

        if (isMod) {
            switch (e.key.toLowerCase()) {
                case 'w':
                    e.preventDefault();
                    const topWindow = getTopWindow();
                    if (topWindow) {
                        closeWindow(topWindow.id);
                    }
                    break;

                case 't':
                    e.preventDefault();
                    openWindow(WINDOW_IDS.TERMINAL);
                    break;

                case 'a':
                    e.preventDefault();
                    openWindow(WINDOW_IDS.ABOUT);
                    break;

                case 'p':
                    e.preventDefault();
                    openWindow(WINDOW_IDS.PROFILE);
                    break;

                case 'm':
                    e.preventDefault();
                    const windowToMinimize = getTopWindow();
                    if (windowToMinimize) {
                        toggleMinimize(windowToMinimize.id);
                    }
                    break;

                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    const position = parseInt(e.key) - 1;
                    const openWindows = getOpenWindows();
                    if (position < openWindows.length) {
                        const sortedWindows = openWindows.sort((a, b) => a.zIndex - b.zIndex);
                        const windowToFocus = sortedWindows[position];
                        if (windowToFocus) {
                            bringToFront(windowToFocus.id);
                        }
                    }
                    break;
            }
        }
    }, [openWindow, closeWindow, toggleMinimize, bringToFront, getTopWindow]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
