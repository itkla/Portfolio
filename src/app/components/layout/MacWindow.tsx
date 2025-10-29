"use client";

import React, {
    useState,
    useRef,
    useEffect,
    MouseEvent as ReactMouseEvent,
    ReactNode,
    CSSProperties,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowAnimations } from "@/hooks/useWindowAnimations";
import { useScrollbarVisibility } from "@/hooks/useScrollbarVisibility";
import { detectSnapZone } from "@/lib/window-manager/utils";
import type { SnapZone } from "@/lib/window-manager/types";

interface MacWindowProps {
    onClose?: () => void;
    onMinimize?: () => void;
    onMaximize?: () => void;
    children: ReactNode;
    defaultWidth?: number;
    defaultHeight?: number;
    defaultX?: number;
    defaultY?: number;

    windowTitle?: string;

    zIndex?: number;
    isFocused?: boolean;
    isMaximized?: boolean;
    previousWidth?: number;
    previousHeight?: number;
    onFocus?: () => void;
    onPositionChange?: (x: number, y: number) => void;
    onSizeChange?: (width: number, height: number) => void;
    onSnap?: (zone: SnapZone) => void;
}

export function MacWindow({
    onClose,
    onMinimize,
    onMaximize,
    children,
    defaultWidth = 400,
    defaultHeight = 300,
    defaultX = 100,
    defaultY = 80,
    windowTitle,
    zIndex = 1,
    isFocused = true,
    isMaximized = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousWidth,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousHeight,
    onFocus,
    onPositionChange,
    onSizeChange,
    onSnap,
}: MacWindowProps) {
    const { variants } = useWindowAnimations();
    
    const scrollableRef = useScrollbarVisibility();

    const [snapZone, setSnapZone] = useState<SnapZone>(null);
    const [isResizeHovered, setIsResizeHovered] = useState(false);

    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);
    const [posX, setPosX] = useState(defaultX);
    const [posY, setPosY] = useState(defaultY);

    useEffect(() => {
        setWidth(defaultWidth);
        setHeight(defaultHeight);
    }, [defaultWidth, defaultHeight]);

    const handleClose = useCallback((e: ReactMouseEvent) => {
        e.stopPropagation();
        onClose?.();
    }, [onClose]);

    const handleMinimize = useCallback((e: ReactMouseEvent) => {
        e.stopPropagation();
        onMinimize?.();
    }, [onMinimize]);

    const handleMaximize = useCallback((e: ReactMouseEvent) => {
        e.stopPropagation();
        onMaximize?.();
    }, [onMaximize]);

    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const currentPosRef = useRef({ x: posX, y: posY });
    const restoringFromMaximizeRef = useRef(false);

    useEffect(() => {
        currentPosRef.current = { x: posX, y: posY };
    }, [posX, posY]);

    useEffect(() => {
        if (!restoringFromMaximizeRef.current) {
            setPosX(defaultX);
            setPosY(defaultY);
        }
        restoringFromMaximizeRef.current = false;
    }, [defaultX, defaultY]);

    const onMouseDownDrag = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (isResizingRef.current) return;
        
        if (!isFocused) {
            onFocus?.();
        }
        
        if (isMaximized) {
            const restoredWidth = previousWidth || defaultWidth;
            const newX = e.clientX - restoredWidth / 2;
            const newY = e.clientY - 20; // Position cursor 20px from top of title bar
            
            restoringFromMaximizeRef.current = true;
            
            setPosX(newX);
            setPosY(newY);
            
            currentPosRef.current = { x: newX, y: newY };
            
            onMaximize?.();
            
            isDraggingRef.current = true;
            dragOffsetRef.current = {
                x: restoredWidth / 2,
                y: 20,
            };
            return;
        }
        isDraggingRef.current = true;
        dragOffsetRef.current = {
            x: e.clientX - posX,
            y: e.clientY - posY,
        };
    };

    const onMouseMoveDrag = useCallback((e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        
        let newX = e.clientX - dragOffsetRef.current.x;
        let newY = e.clientY - dragOffsetRef.current.y;
        
        const minVisibleWidth = 50;
        const titleBarHeight = 28;
        const maxX = window.innerWidth - minVisibleWidth;
        const maxY = window.innerHeight - titleBarHeight;
        
        newX = Math.max(-width + minVisibleWidth, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        setPosX(newX);
        setPosY(newY);

        const zone = detectSnapZone(e.clientX, e.clientY, {
            width: window.innerWidth,
            height: window.innerHeight,
        });
        setSnapZone(zone);
    }, [width]);

    const onMouseUpDrag = useCallback(() => {
        if (isDraggingRef.current) {
            if (snapZone && onSnap) {
                onSnap(snapZone);
                setSnapZone(null);
            } else if (onPositionChange) {
                onPositionChange(currentPosRef.current.x, currentPosRef.current.y);
            }
        }
        isDraggingRef.current = false;
    }, [onPositionChange, onSnap, snapZone]);

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMoveDrag);
        document.addEventListener("mouseup", onMouseUpDrag);
        return () => {
            document.removeEventListener("mousemove", onMouseMoveDrag);
            document.removeEventListener("mouseup", onMouseUpDrag);
        };
    }, [onMouseUpDrag]);

    const isResizingRef = useRef(false);
    const lastMousePositionRef = useRef({ x: 0, y: 0 });
    const currentSizeRef = useRef({ width, height });

    useEffect(() => {
        currentSizeRef.current = { width, height };
    }, [width, height]);

    const onMouseDownResize = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isMaximized || isDraggingRef.current) return;
        isResizingRef.current = true;
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
        if (!isFocused) {
            onFocus?.();
        }
    }, [isMaximized, isFocused, onFocus]);

    const onMouseMoveResize = useCallback((e: MouseEvent) => {
        if (!isResizingRef.current) return;
        const deltaX = e.clientX - lastMousePositionRef.current.x;
        const deltaY = e.clientY - lastMousePositionRef.current.y;
        setWidth((w) => Math.max(150, w + deltaX));
        setHeight((h) => Math.max(50, h + deltaY));
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const onMouseUpResize = useCallback(() => {
        if (isResizingRef.current && onSizeChange) {
            onSizeChange(currentSizeRef.current.width, currentSizeRef.current.height);
        }
        isResizingRef.current = false;
    }, [onSizeChange]);

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMoveResize);
        document.addEventListener("mouseup", onMouseUpResize);
        return () => {
            document.removeEventListener("mousemove", onMouseMoveResize);
            document.removeEventListener("mouseup", onMouseUpResize);
        };
    }, [onMouseUpResize]);

    const contentStyle: CSSProperties = { display: "block" };

    return (
        <>
            <AnimatePresence>
                {snapZone && isDraggingRef.current && (
                    <SnapZonePreview zone={snapZone} />
                )}
            </AnimatePresence>

            <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            style={{
                position: "absolute",
                left: posX,
                top: posY,
                width: width + "px",
                height: height + "px",
                zIndex: zIndex,
            }}
            className="flex flex-col
        rounded-xl border border-neutral-700
        bg-[#060606]/60 backdrop-blur-sm
        text-white text-xs
        shadow-lg
        overflow-hidden"
            onMouseDown={() => {
                if (!isFocused) {
                    onFocus?.();
                }
            }}
            role="dialog"
            aria-label={windowTitle || "Untitled"}
            aria-modal="false"
        >
            <div
                className="flex items-center px-2 py-1"
                style={{ cursor: isMaximized ? "default" : "move" }}
                onMouseDown={onMouseDownDrag}
            >
                <div className="flex space-x-1 mr-2">
                    <button
                        onClick={handleClose}
                        className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600"
                        aria-label="Close window"
                        title="Close"
                    />
                    <button
                        onClick={handleMinimize}
                        className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
                        aria-label="Minimize window"
                        title="Minimize"
                    />
                    <button
                        onClick={handleMaximize}
                        className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600"
                        aria-label={isMaximized ? "Restore window" : "Maximize window"}
                        title={isMaximized ? "Restore" : "Maximize"}
                    />
                </div>
                <span className="ml-2 text-neutral-300 font-medium flex-1">
                    {windowTitle || "Untitled"}
                </span>
            </div>

            <div
                ref={scrollableRef}
                className="relative flex-1 p-2 overflow-auto"
                style={contentStyle}
            >
                {children}
            </div>

            {!isMaximized && (
                <div
                    onMouseDown={onMouseDownResize}
                    onMouseEnter={() => setIsResizeHovered(true)}
                    onMouseLeave={() => setIsResizeHovered(false)}
                    className="absolute bottom-1 right-1 w-3 h-3 cursor-se-resize group z-10"
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className="absolute bottom-0 right-0 pointer-events-none"
                        style={{
                            opacity: isFocused || isResizeHovered ? 1 : 0,
                            transform: isFocused || isResizeHovered ? 'translate(0, 0)' : 'translate(4px, 4px)',
                            transition: 'opacity 150ms ease-in-out, transform 150ms ease-in-out'
                        }}
                    >
                        <line
                            x1="10"
                            y1="6"
                            x2="6"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                            strokeLinecap="round"
                        />
                        <line
                            x1="10"
                            y1="3"
                            x2="3"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                            strokeLinecap="round"
                        />
                        <line
                            x1="10"
                            y1="0"
                            x2="0"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            )}
        </motion.div>
        </>
    );
}

function SnapZonePreview({ zone }: { zone: SnapZone }) {
    const getPreviewStyle = (): CSSProperties => {
        const base: CSSProperties = {
            position: 'fixed',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            border: '2px solid rgb(59, 130, 246)',
            pointerEvents: 'none',
            zIndex: 9998,
        };

        const w = window.innerWidth;
        const h = window.innerHeight;
        const halfW = w / 2;
        const halfH = h / 2;

        switch (zone) {
            case 'left':
                return { ...base, left: 0, top: 0, width: `${halfW}px`, height: '100%' };
            case 'right':
                return { ...base, right: 0, top: 0, width: `${halfW}px`, height: '100%' };
            case 'top':
                return { ...base, left: 0, top: 0, width: '100%', height: '100%' };
            case 'top-left':
                return { ...base, left: 0, top: 0, width: `${halfW}px`, height: `${halfH}px` };
            case 'top-right':
                return { ...base, right: 0, top: 0, width: `${halfW}px`, height: `${halfH}px` };
            case 'bottom-left':
                return { ...base, left: 0, bottom: 0, width: `${halfW}px`, height: `${halfH}px` };
            case 'bottom-right':
                return { ...base, right: 0, bottom: 0, width: `${halfW}px`, height: `${halfH}px` };
            default:
                return base;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={getPreviewStyle()}
        />
    );
}
