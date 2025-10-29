export { useDesktop } from './hooks/useDesktop';
export type { TerminalState } from './hooks/useDesktop';
export { useWindowManager } from './hooks/useWindowManager';

export type {
    WindowId,
    WindowSize,
    WindowPosition,
    WindowState,
    WindowConfig,
    WindowRenderContext,
    ViewMode,
    SnapZone,
} from './types';

export { WINDOW_IDS } from './constants';
export { WINDOW_REGISTRY } from './registry';
