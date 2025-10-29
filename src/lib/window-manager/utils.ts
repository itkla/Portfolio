import type { WindowPosition, WindowSize } from './types';
import { POSITIONING, SNAP_SETTINGS } from './constants';
import type { SnapZone } from './types';

export const calculateCenterPosition = (
    windowSize: WindowSize,
    viewportSize: WindowSize
): WindowPosition => ({
    x: Math.max(0, (viewportSize.width - windowSize.width) / 2),
    y: Math.max(0, (viewportSize.height - windowSize.height) / 2),
});

export const calculateCascadePosition = (
    index: number,
    offset = POSITIONING.CASCADE_OFFSET
): WindowPosition => ({
    x: 100 + (index * offset),
    y: 80 + (index * offset),
});

export const snapToGrid = (
    position: WindowPosition,
    gridSize = POSITIONING.GRID_SIZE
): WindowPosition => ({
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
});

export const constrainToViewport = (
    position: WindowPosition,
    size: WindowSize,
    viewportSize: WindowSize,
    minPadding = POSITIONING.MIN_PADDING
): WindowPosition => {
    const maxX = viewportSize.width - size.width - minPadding;
    const maxY = viewportSize.height - size.height - minPadding;

    return {
        x: Math.max(minPadding, Math.min(position.x, maxX)),
        y: Math.max(minPadding, Math.min(position.y, maxY)),
    };
};

export const areWindowsOverlapping = (
    pos1: WindowPosition,
    size1: WindowSize,
    pos2: WindowPosition,
    size2: WindowSize
): boolean => {
    return !(
        pos1.x + size1.width < pos2.x ||
        pos2.x + size2.width < pos1.x ||
        pos1.y + size1.height < pos2.y ||
        pos2.y + size2.height < pos1.y
    );
};

export const getMaximizedSize = (
    viewportSize: WindowSize,
    padding = 0
): WindowSize => ({
    width: viewportSize.width - (padding * 2),
    height: viewportSize.height - (padding * 2),
});

export const getMaximizedPosition = (padding = 0): WindowPosition => ({
    x: padding,
    y: padding,
});

export const detectSnapZone = (
    cursorX: number,
    cursorY: number,
    viewportSize: WindowSize,
    snapThreshold = SNAP_SETTINGS.THRESHOLD
): SnapZone => {
    const { width, height } = viewportSize;
    const isLeft = cursorX <= snapThreshold;
    const isRight = cursorX >= width - snapThreshold;
    const isTop = cursorY <= snapThreshold;
    const isBottom = cursorY >= height - snapThreshold;

    const cornerThreshold = snapThreshold / 2;
    if (isTop && isLeft && cursorX <= cornerThreshold && cursorY <= cornerThreshold) {
        return 'top-left';
    }
    if (isTop && isRight && cursorX >= width - cornerThreshold && cursorY <= cornerThreshold) {
        return 'top-right';
    }
    if (isBottom && isLeft && cursorX <= cornerThreshold && cursorY >= height - cornerThreshold) {
        return 'bottom-left';
    }
    if (isBottom && isRight && cursorX >= width - cornerThreshold && cursorY >= height - cornerThreshold) {
        return 'bottom-right';
    }

    if (isLeft) return 'left';
    if (isRight) return 'right';
    if (isTop) return 'top';

    return null;
};

export const getSnappedWindowBounds = (
    zone: SnapZone,
    viewportSize: WindowSize,
    padding = 0
): { position: WindowPosition; size: WindowSize } => {
    const { width, height } = viewportSize;
    const halfWidth = (width - padding * 3) / 2;
    const halfHeight = (height - padding * 3) / 2;

    switch (zone) {
        case 'left':
            return {
                position: { x: padding, y: padding },
                size: { width: halfWidth, height: height - padding * 2 },
            };
        case 'right':
            return {
                position: { x: halfWidth + padding * 2, y: padding },
                size: { width: halfWidth, height: height - padding * 2 },
            };
        case 'top':
            return {
                position: { x: padding, y: padding },
                size: { width: width - padding * 2, height: height - padding * 2 },
            };
        case 'top-left':
            return {
                position: { x: padding, y: padding },
                size: { width: halfWidth, height: halfHeight },
            };
        case 'top-right':
            return {
                position: { x: halfWidth + padding * 2, y: padding },
                size: { width: halfWidth, height: halfHeight },
            };
        case 'bottom-left':
            return {
                position: { x: padding, y: halfHeight + padding * 2 },
                size: { width: halfWidth, height: halfHeight },
            };
        case 'bottom-right':
            return {
                position: { x: halfWidth + padding * 2, y: halfHeight + padding * 2 },
                size: { width: halfWidth, height: halfHeight },
            };
        default:
            return {
                position: { x: padding, y: padding },
                size: { width: width - padding * 2, height: height - padding * 2 },
            };
    }
};
