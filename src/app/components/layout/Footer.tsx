"use client";

import Dock from '@/app/components/layout/Dock/Dock';
import {
    FaLine, 
    FaEnvelope,
    FaGithub,
    FaInstagram,
    FaUser,
    FaTerminal,
    FaIdCard,
    FaFileLines
} from "react-icons/fa6";
import { Flower2 } from "lucide-react";
import type { ReactNode } from 'react';
import { WINDOW_IDS } from '@/lib/window-manager';

export interface MinimizedWindow {
    id: string;
    title: string;
    icon?: ReactNode;
}

interface FooterProps {
    onOpenProfile?: () => void;
    onOpenAbout?: () => void;
    onOpenTerminal?: () => void;
    onOpenTextEditor?: () => void;
    onOpenPixelGarden?: () => void;
    minimizedWindows?: MinimizedWindow[];
    onRestoreWindow?: (id: string) => void;
}

const DOCK_APP_IDS = new Set<string>([
    WINDOW_IDS.PROFILE,
    WINDOW_IDS.ABOUT,
    WINDOW_IDS.TERMINAL,
    WINDOW_IDS.TEXT_EDITOR,
    WINDOW_IDS.PIXEL_GARDEN,
]);

export default function Footer({ 
    onOpenProfile, 
    onOpenAbout, 
    onOpenTerminal,
    onOpenTextEditor,
    onOpenPixelGarden,
    minimizedWindows = [],
    onRestoreWindow
}: FooterProps) {
    const isMinimized = (windowId: string) => 
        minimizedWindows.some(w => w.id === windowId);

    const staticItems = [
        { 
            icon: <FaUser size={18} />, 
            label: 'Home', 
            onClick: () => { 
                if (isMinimized(WINDOW_IDS.PROFILE)) {
                    onRestoreWindow?.(WINDOW_IDS.PROFILE);
                } else {
                    onOpenProfile?.();
                }
            },
            className: isMinimized(WINDOW_IDS.PROFILE) ? 'bg-white/10' : '',
        },
        { 
            icon: <FaIdCard size={18} />, 
            label: 'About', 
            onClick: () => { 
                if (isMinimized(WINDOW_IDS.ABOUT)) {
                    onRestoreWindow?.(WINDOW_IDS.ABOUT);
                } else {
                    onOpenAbout?.();
                }
            },
            className: isMinimized(WINDOW_IDS.ABOUT) ? 'bg-white/10' : '',
        },
        { icon: <FaGithub size={18} />, label: 'Github', onClick: () => { window.open('https://github.com/itkla', '_blank') }, className: '' },
        { icon: <FaInstagram size={18} />, label: 'Instagram', onClick: () => { window.open('https://instagram.com/hunternakagawa', '_blank') }, className: '' },
        { icon: <FaLine size={18} />, label: 'LINE', onClick: () => { window.open('https://line.me/ti/p/eEv6U32P63', '_blank') }, className: '' },
        { icon: <FaEnvelope size={18} />, label: 'Mail', onClick: () => { window.location.href = 'mailto:hello@klae.ooo' }, className: '' },
        { 
            icon: <FaTerminal size={18} />, 
            label: 'Terminal', 
            onClick: () => { 
                if (isMinimized(WINDOW_IDS.TERMINAL)) {
                    onRestoreWindow?.(WINDOW_IDS.TERMINAL);
                } else {
                    onOpenTerminal?.();
                }
            },
            className: isMinimized(WINDOW_IDS.TERMINAL) ? 'bg-white/10' : '',
        },
        { 
            icon: <FaFileLines size={18} />, 
            label: 'TextEdit', 
            onClick: () => { 
                if (isMinimized(WINDOW_IDS.TEXT_EDITOR)) {
                    onRestoreWindow?.(WINDOW_IDS.TEXT_EDITOR);
                } else {
                    onOpenTextEditor?.();
                }
            },
            className: isMinimized(WINDOW_IDS.TEXT_EDITOR) ? 'bg-white/10' : '',
        },
        { 
            icon: <Flower2 size={18} />, 
            label: 'Pixel Garden', 
            onClick: () => { 
                if (isMinimized(WINDOW_IDS.PIXEL_GARDEN)) {
                    onRestoreWindow?.(WINDOW_IDS.PIXEL_GARDEN);
                } else {
                    onOpenPixelGarden?.();
                }
            },
            className: isMinimized(WINDOW_IDS.PIXEL_GARDEN) ? 'bg-white/10' : '',
        },
    ];

    const dynamicWindows = minimizedWindows.filter(w => !DOCK_APP_IDS.has(w.id as string));
    
    const dynamicItems = dynamicWindows.map((win) => ({
        icon: win.icon || <FaUser size={18} />,
        label: win.title,
        onClick: () => onRestoreWindow?.(win.id),
        className: 'bg-white/10',
    }));

    const items = [...staticItems, ...dynamicItems];

    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
            <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
            />
        </div>
    );
}