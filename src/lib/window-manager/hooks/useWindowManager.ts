'use client';

import { useWindowStore } from '../store';

export function useWindowManager() {
    const store = useWindowStore();

    return {
        windows: store.windows,
        viewMode: store.viewMode,
        viewportSize: store.viewportSize,

        initializeWindows: store.initializeWindows,
        setViewportSize: store.setViewportSize,

        setViewMode: store.setViewMode,
        toggleViewMode: store.toggleViewMode,

        openWindow: store.openWindow,
        closeWindow: store.closeWindow,
        bringToFront: store.bringToFront,
        toggleMinimize: store.toggleMinimize,
        toggleMaximize: store.toggleMaximize,
        updateWindowPosition: store.updateWindowPosition,
        updateWindowSize: store.updateWindowSize,
        snapWindow: store.snapWindow,

        getWindow: store.getWindow,
        getAllWindows: store.getAllWindows,
        getOpenWindows: store.getOpenWindows,
        resetWindows: store.resetWindows,
    };
}
