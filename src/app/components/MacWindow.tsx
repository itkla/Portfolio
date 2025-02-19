"use client";

import React, {
    useState,
    useRef,
    useEffect,
    MouseEvent as ReactMouseEvent,
    ReactNode,
    CSSProperties,
} from "react";

interface MacWindowProps {
    onClose?: () => void;
    children: ReactNode;
    defaultWidth?: number;
    defaultHeight?: number;
    defaultX?: number;
    defaultY?: number;

    windowTitle?: string;

    /** The parent's assigned zIndex */
    zIndex?: number;
    onFocus?: () => void;
}

export function MacWindow({
    onClose,
    children,
    defaultWidth = 400,
    defaultHeight = 300,
    defaultX = 100,
    defaultY = 80,
    windowTitle,
    zIndex = 1,
    onFocus,
}: MacWindowProps) {
    // Internal states
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);
    const [posX, setPosX] = useState(defaultX);
    const [posY, setPosY] = useState(defaultY);

    // Store previous size/pos before maximize
    const prevSizeRef = useRef({ width: defaultWidth, height: defaultHeight, x: defaultX, y: defaultY });

    // Traffic Light
    const handleClose = (e: ReactMouseEvent) => {
        e.stopPropagation();
        onClose?.();
    };

    const handleMinimize = (e: ReactMouseEvent) => {
        e.stopPropagation();
        setIsMinimized((prev) => !prev);
    };

    const handleMaximize = (e: ReactMouseEvent) => {
        e.stopPropagation();
        setIsMaximized((prev) => {
            const next = !prev;
            if (next) {
                prevSizeRef.current = { width, height, x: posX, y: posY };
                setPosX(0);
                setPosY(0);
                setWidth(800);
                setHeight(600);
            } else {
                setPosX(prevSizeRef.current.x);
                setPosY(prevSizeRef.current.y);
                setWidth(prevSizeRef.current.width);
                setHeight(prevSizeRef.current.height);
            }
            return next;
        });
    };

    // Draggable logic
    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    const onMouseDownDrag = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (isMaximized) return;
        isDraggingRef.current = true;
        dragOffsetRef.current = {
            x: e.clientX - posX,
            y: e.clientY - posY,
        };
        // Bring to front on mousedown
        onFocus?.();
    };

    const onMouseMoveDrag = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        setPosX(e.clientX - dragOffsetRef.current.x);
        setPosY(e.clientY - dragOffsetRef.current.y);
    };

    const onMouseUpDrag = () => {
        isDraggingRef.current = false;
    };

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMoveDrag);
        document.addEventListener("mouseup", onMouseUpDrag);
        return () => {
            document.removeEventListener("mousemove", onMouseMoveDrag);
            document.removeEventListener("mouseup", onMouseUpDrag);
        };
    }, []);

    // Resizing logic
    const isResizingRef = useRef(false);
    const lastMousePositionRef = useRef({ x: 0, y: 0 });

    const onMouseDownResize = (e: ReactMouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isMaximized) return;
        isResizingRef.current = true;
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
        // Also bring to front if you click the resize handle
        onFocus?.();
    };

    const onMouseMoveResize = (e: MouseEvent) => {
        if (!isResizingRef.current) return;
        const deltaX = e.clientX - lastMousePositionRef.current.x;
        const deltaY = e.clientY - lastMousePositionRef.current.y;
        setWidth((w) => Math.max(150, w + deltaX));
        setHeight((h) => Math.max(50, h + deltaY));
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUpResize = () => {
        isResizingRef.current = false;
    };

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMoveResize);
        document.addEventListener("mouseup", onMouseUpResize);
        return () => {
            document.removeEventListener("mousemove", onMouseMoveResize);
            document.removeEventListener("mouseup", onMouseUpResize);
        };
    }, []);

    // Minimized => hide content
    const contentStyle: CSSProperties = isMinimized
        ? { display: "none" }
        : { display: "block" };

    return (
        <div
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
            // Also bring to front if the user clicks anywhere in the window background
            onMouseDown={() => onFocus?.()}
        >
            {/* Title Bar */}
            <div
                className="flex items-center px-2 py-1"
                style={{ cursor: isMaximized ? "default" : "move" }}
                onMouseDown={onMouseDownDrag}
            >
                <div className="flex space-x-1 mr-2">
                    <button
                        onClick={handleClose}
                        className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600"
                    />
                    <button
                        onClick={handleMinimize}
                        className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
                    />
                    <button
                        onClick={handleMaximize}
                        className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600"
                    />
                </div>
                <span className="ml-2 text-neutral-300 font-medium flex-1">
                    {windowTitle || "Untitled"}
                </span>
            </div>

            {/* Content */}
            <div
                className="relative flex-1 p-2 overflow-auto"
                style={{
                    ...contentStyle,
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE 10+
                }}
            >
                {children}
            </div>

            {!isMaximized && (
                <div
                    onMouseDown={onMouseDownResize}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
                />
            )}
        </div>
    );
}
