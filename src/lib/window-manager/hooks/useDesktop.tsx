'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useWindowManager } from './useWindowManager';
import { useWindowStore } from '../store';
import { WINDOW_REGISTRY } from '../registry';
import type { WindowId, WindowRenderContext, SnapZone, WindowState } from '../types';
import { MacWindow } from '@/app/components/layout/MacWindow';

export interface TerminalState {
    command: string;
    setCommand: (cmd: string) => void;
    history: (string | React.ReactElement)[];
    onExecuteCommand: (cmd: string) => void;
}

export function useDesktop(terminalState?: TerminalState) {
    const t = useTranslations();
    const windowManager = useWindowManager();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        windowManager.initializeWindows(WINDOW_REGISTRY, t, viewport);
        windowManager.setViewportSize(viewport);

        const handleResize = () => {
            windowManager.setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const terminalContext = useMemo(() => terminalState ? {
        command: terminalState.command,
        setCommand: terminalState.setCommand,
        history: terminalState.history,
        executeCommand: terminalState.onExecuteCommand,
    } : undefined, [terminalState?.command, terminalState?.setCommand, terminalState?.history, terminalState?.onExecuteCommand]);

    const createRenderContext = useCallback((windowId: WindowId): WindowRenderContext => ({
        windowId,
        openWindow: windowManager.openWindow,
        closeWindow: windowManager.closeWindow,
        terminal: terminalContext,
    }), [windowManager.openWindow, windowManager.closeWindow, terminalContext]);

    const windowsKey = useWindowStore((state) => {
        const windows = Object.values(state.windows).filter((w: WindowState) => w.isOpen && !w.isMinimized);
        return windows.map(w =>
            `${w.id}:${w.zIndex}:${w.position.x}:${w.position.y}:${w.size.width}:${w.size.height}:${w.isMaximized}`
        ).join('|');
    });

    const getOpenWindows = useWindowStore((state) => state.getOpenWindows);
    const highestZIndex = useWindowStore((state) => state.highestZIndex);
    const bringToFront = useWindowStore((state) => state.bringToFront);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const toggleMinimize = useWindowStore((state) => state.toggleMinimize);
    const toggleMaximize = useWindowStore((state) => state.toggleMaximize);
    const updateWindowPosition = useWindowStore((state) => state.updateWindowPosition);
    const updateWindowSize = useWindowStore((state) => state.updateWindowSize);
    const snapWindow = useWindowStore((state) => state.snapWindow);

    const renderWindows = useMemo(() => {
        const openWindows = getOpenWindows();

        return openWindows.map((window) => {
            const config = WINDOW_REGISTRY[window.id];
            if (!config) return null;

            const renderContext = createRenderContext(window.id);
            const content = config.render(renderContext);

            return (
                <MacWindow
                    key={window.id}
                    windowTitle={window.title}
                    defaultWidth={window.size.width}
                    defaultHeight={window.size.height}
                    defaultX={window.position.x}
                    defaultY={window.position.y}
                    zIndex={window.zIndex}
                    isFocused={window.zIndex === highestZIndex}
                    isMaximized={window.isMaximized}
                    previousWidth={window.previousSize?.width}
                    previousHeight={window.previousSize?.height}
                    onFocus={() => bringToFront(window.id)}
                    onClose={() => closeWindow(window.id)}
                    onMinimize={() => toggleMinimize(window.id)}
                    onMaximize={() => toggleMaximize(window.id)}
                    onPositionChange={(x: number, y: number) => updateWindowPosition(window.id, x, y)}
                    onSizeChange={(width: number, height: number) => updateWindowSize(window.id, width, height)}
                    onSnap={(zone: SnapZone) => snapWindow(window.id, zone)}
                >
                    {content}
                </MacWindow>
            );
        });
    }, [windowsKey, highestZIndex, createRenderContext, bringToFront, closeWindow, toggleMinimize, toggleMaximize, updateWindowPosition, updateWindowSize, snapWindow, getOpenWindows]);

    return {
        renderWindows,
        windowManager,
        viewMode: windowManager.viewMode,
        setViewMode: windowManager.setViewMode,
        toggleViewMode: windowManager.toggleViewMode,
    };
}
