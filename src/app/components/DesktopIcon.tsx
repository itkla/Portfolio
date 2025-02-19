import React from "react";

interface DesktopIconProps {
    label: string;
    iconSrc: React.ReactNode;
    onDoubleClick?: () => void; // or onClick
}

export function DesktopIcon({ label, iconSrc, onDoubleClick }: DesktopIconProps) {
    return (
        <div
            className="flex flex-col items-center cursor-default select-none"
            onDoubleClick={onDoubleClick}
        >
            {iconSrc}
            <span className="mt-1 text-white text-sm">{label}</span>
        </div>
    );
}
