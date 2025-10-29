import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WindowState, WindowSize, WindowId, ViewMode, SnapZone } from './types';
import {
    calculateCenterPosition,
    calculateCascadePosition,
    getMaximizedSize,
    getMaximizedPosition,
    getSnappedWindowBounds,
} from './utils';
import { Z_INDEX } from './constants';

export interface WindowRegistryEntry {
    id: WindowId;
    titleKey: string;
    defaultSize: WindowSize;
    defaultPosition: 'center' | 'cascade' | { x: number; y: number };
    openOnMount?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (context: any) => React.ReactNode;
}

interface WindowStore {
    windows: Record<WindowId, WindowState>;
    highestZIndex: number;
    cascadeIndex: number;
    viewportSize: WindowSize;
    viewMode: ViewMode;

    initializeWindows: (
        registry: Record<WindowId, WindowRegistryEntry>,
        t: (key: string) => string,
        viewport: WindowSize
    ) => void;
    setViewportSize: (size: WindowSize) => void;

    setViewMode: (mode: ViewMode) => void;
    toggleViewMode: () => void;

    openWindow: (id: WindowId) => void;
    closeWindow: (id: WindowId) => void;
    bringToFront: (id: WindowId) => void;
    toggleMinimize: (id: WindowId) => void;
    toggleMaximize: (id: WindowId) => void;
    updateWindowPosition: (id: WindowId, x: number, y: number) => void;
    updateWindowSize: (id: WindowId, width: number, height: number) => void;
    snapWindow: (id: WindowId, zone: SnapZone) => void;

    getWindow: (id: WindowId) => WindowState | undefined;
    getAllWindows: () => WindowState[];
    getOpenWindows: () => WindowState[];

    resetWindows: () => void;
}

export const useWindowStore = create<WindowStore>()(
    persist(
        (set, get): WindowStore => ({
            windows: {},
            highestZIndex: 1,
            cascadeIndex: 0,
            viewportSize: { width: 0, height: 0 },
            viewMode: 'desktop' as ViewMode,

            initializeWindows: (registry, t, viewport) => {
                const existingWindows = get().windows;
                const initialWindows: Record<WindowId, WindowState> = {};
                let currentCascadeIndex = 0;
                let maxZIndex: number = 1;

                Object.values(registry).forEach((config) => {
                    const existingWindow = existingWindows[config.id];

                    const size = existingWindow?.size || config.defaultSize;
                    let position;

                    if (existingWindow?.position) {
                        position = existingWindow.position;
                    } else {
                        if (config.defaultPosition === 'center') {
                            position = calculateCenterPosition(size, viewport);
                        } else if (config.defaultPosition === 'cascade') {
                            position = calculateCascadePosition(currentCascadeIndex);
                            currentCascadeIndex++;
                        } else {
                            position = config.defaultPosition;
                        }
                    }

                    const isOpen = existingWindow?.isOpen !== undefined
                        ? existingWindow.isOpen
                        : (config.openOnMount ?? false);

                    const zIndex: number = existingWindow?.zIndex ?? (isOpen ? 1 : 0);
                    if (zIndex > maxZIndex) {
                        maxZIndex = zIndex;
                    }

                    const windowState: WindowState = {
                        id: config.id,
                        title: t(config.titleKey),
                        isOpen,
                        isMinimized: false,
                        isMaximized: false,
                        zIndex,
                        position,
                        size,
                    };

                    initialWindows[config.id] = windowState;
                });

                set({
                    windows: initialWindows,
                    cascadeIndex: currentCascadeIndex,
                    highestZIndex: maxZIndex + 1,
                    viewportSize: viewport,
                });
            },

            setViewportSize: (size) => {
                set({ viewportSize: size });
            },

            setViewMode: (mode) => {
                set({ viewMode: mode });
            },

            toggleViewMode: () => {
                set((state) => ({
                    viewMode: state.viewMode === 'desktop' ? 'simplified' : 'desktop',
                }));
            },

            openWindow: (id) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                const newZIndex = state.highestZIndex + 1;

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            isOpen: true,
                            isMinimized: false,
                            zIndex: newZIndex,
                        },
                    },
                    highestZIndex: newZIndex,
                });
            },

            closeWindow: (id) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            isOpen: false,
                            isMinimized: false,
                            isMaximized: false,
                        },
                    },
                });
            },

            bringToFront: (id) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                if (window.zIndex === state.highestZIndex) return;

                const newZIndex = state.highestZIndex + 1;

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            zIndex: newZIndex,
                        },
                    },
                    highestZIndex: newZIndex,
                });
            },

            toggleMinimize: (id) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            isMinimized: !window.isMinimized,
                        },
                    },
                });
            },

            toggleMaximize: (id) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                if (window.isMaximized) {
                    set({
                        windows: {
                            ...state.windows,
                            [id]: {
                                ...window,
                                isMaximized: false,
                                position: window.previousPosition || window.position,
                                size: window.previousSize || window.size,
                                previousPosition: undefined,
                                previousSize: undefined,
                            },
                        },
                    });
                } else {
                    set({
                        windows: {
                            ...state.windows,
                            [id]: {
                                ...window,
                                isMaximized: true,
                                previousPosition: window.position,
                                previousSize: window.size,
                                position: getMaximizedPosition(),
                                size: getMaximizedSize(state.viewportSize),
                            },
                        },
                    });
                }
            },

            updateWindowPosition: (id, x, y) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            position: { x, y },
                        },
                    },
                });
            },

            updateWindowSize: (id, width, height) => {
                const state = get();
                const window = state.windows[id];
                if (!window) return;

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            size: { width, height },
                        },
                    },
                });
            },

            snapWindow: (id, zone) => {
                const state = get();
                const window = state.windows[id];
                if (!window || !zone) return;

                const { position, size } = getSnappedWindowBounds(zone, state.viewportSize);

                const isMaximizing = zone === 'top';

                const previousPosition = window.isMaximized
                    ? window.previousPosition
                    : (isMaximizing ? window.position : undefined);
                const previousSize = window.isMaximized
                    ? window.previousSize
                    : (isMaximizing ? window.size : undefined);

                set({
                    windows: {
                        ...state.windows,
                        [id]: {
                            ...window,
                            position,
                            size,
                            isMaximized: isMaximizing,
                            previousPosition,
                            previousSize,
                        },
                    },
                });
            },

            getWindow: (id) => {
                return get().windows[id];
            },

            getAllWindows: () => {
                return Object.values(get().windows);
            },

            getOpenWindows: () => {
                return Object.values(get().windows).filter((w) => w.isOpen && !w.isMinimized);
            },

            resetWindows: () => {
                set({
                    windows: {},
                    highestZIndex: Z_INDEX.INITIAL,
                    cascadeIndex: 0,
                });
            },
        }),
        {
            name: 'portfolio-window-state',
            storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
                getItem: () => null,
                setItem: () => { },
                removeItem: () => { },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any)),
            partialize: (state) => ({
                windows: Object.fromEntries(
                    Object.entries(state.windows).map(([id, window]) => [
                        id,
                        {
                            position: window.position,
                            size: window.size,
                            isOpen: window.isOpen,
                            zIndex: window.zIndex,
                        },
                    ])
                ),
            }) as Partial<WindowStore>,
        }
    )
);
