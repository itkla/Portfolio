import type { ReactNode } from 'react';

export type WindowId = string;

export interface WindowPosition {
    x: number;
    y: number;
}

export interface WindowSize {
    width: number;
    height: number;
}

export type SnapZone =
    | 'left'
    | 'right'
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | null;

export interface WindowState {
    id: WindowId;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    position: WindowPosition;
    size: WindowSize;
    previousPosition?: WindowPosition;
    previousSize?: WindowSize;
}

export interface WindowRenderContext {
    windowId: WindowId;
    openWindow: (id: WindowId) => void;
    closeWindow: (id: WindowId) => void;
    terminal?: {
        command: string;
        setCommand: (cmd: string) => void;
        history: (string | React.ReactElement)[];
        executeCommand: (cmd: string) => void;
        currentDir: string;
    };
}

export interface WindowConfig {
    id: WindowId;
    titleKey: string;
    icon?: ReactNode;
    defaultSize: WindowSize;
    defaultPosition: 'center' | 'cascade' | WindowPosition;
    canMinimize?: boolean;
    canMaximize?: boolean;
    canResize?: boolean;
    openOnMount?: boolean;

    render: (context: WindowRenderContext) => ReactNode;
}

export interface DesktopIconConfig {
    id: WindowId;
    label: string;
    icon: ReactNode;
    position: { left: number; top: number };
}

export type ViewMode = 'desktop' | 'simplified';
