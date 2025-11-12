"use client";

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { FaFolder, FaLock } from "react-icons/fa6";
import Footer from "@/app/components/layout/Footer";
import type { MinimizedWindow } from "@/app/components/layout/Footer";
import { DesktopIcon } from "@/app/components/common/DesktopIcon";
import ClickSpark from "@/app/components/effects/ClickSpark/ClickSpark";
import { SimplifiedView } from "@/app/components/layout/SimplifiedView";
import { ViewToggleButton } from "@/app/components/ui/ViewToggleButton";
import { useDesktop, WINDOW_IDS, WINDOW_REGISTRY } from '@/lib/window-manager';
import { useTerminal } from '@/hooks/useTerminal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { WindowId } from '@/constants/windows';
import { Toaster } from '@/components/ui/toaster';
import { DESKTOP_ICON_POSITIONS } from '@/constants/windows';

export default function Home() {
    const t = useTranslations();
    const { command, setCommand, history, executeCommand } = useTerminal();
    const [mounted, setMounted] = useState(false);

    const desktop = useDesktop({
        command,
        setCommand,
        history,
        onExecuteCommand: executeCommand,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth < 768;

        if (isMobile || isSmallScreen) {
            desktop.setViewMode('simplified');
        }
    }, [desktop.setViewMode]);

    const getOpenWindowsForShortcuts = useCallback(() => {
        return desktop.windowManager.getOpenWindows()
            .map(w => ({ id: w.id as WindowId, zIndex: w.zIndex }));
    }, [desktop.windowManager.windows]);

    useKeyboardShortcuts({
        openWindow: desktop.windowManager.openWindow,
        closeWindow: desktop.windowManager.closeWindow,
        toggleMinimize: desktop.windowManager.toggleMinimize,
        bringToFront: desktop.windowManager.bringToFront,
        getOpenWindows: getOpenWindowsForShortcuts,
    });

    const minimizedWindows: MinimizedWindow[] = useMemo(() => {
        const allWindows = desktop.windowManager.getAllWindows();
        return allWindows
            .filter(w => w.isOpen && w.isMinimized)
            .map(w => {
                const config = WINDOW_REGISTRY[w.id];
                return {
                    id: w.id,
                    title: w.title,
                    icon: config?.icon,
                };
            });
    }, [desktop.windowManager.windows]);

    return (
        <>
            {desktop.viewMode === 'simplified' ? (
                <>
                    <SimplifiedView />
                    <ViewToggleButton />
                </>
            ) : (
                <div className="relative w-screen h-screen overflow-hidden">
                    <ClickSpark
                        sparkColor="#fff"
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                    />

                    <div className="absolute" style={DESKTOP_ICON_POSITIONS.WORKS}>
                        <DesktopIcon
                            label={t('desktop.works')}
                            iconSrc={<FaFolder className="w-8 h-8" />}
                            onDoubleClick={() => desktop.windowManager.openWindow(WINDOW_IDS.WORKS)}
                        />
                    </div>

                    <div className="absolute" style={DESKTOP_ICON_POSITIONS.ENCRYPTED_FILE}>
                        <DesktopIcon
                            label={t('desktop.secret')}
                            iconSrc={<FaLock className="w-8 h-8" />}
                            onDoubleClick={() => desktop.windowManager.openWindow(WINDOW_IDS.ENCRYPTED_FILE)}
                        />
                    </div>

                    {mounted && desktop.renderWindows}

                    <Footer
                        onOpenProfile={() => desktop.windowManager.openWindow(WINDOW_IDS.PROFILE)}
                        onOpenAbout={() => desktop.windowManager.openWindow(WINDOW_IDS.ABOUT)}
                        onOpenTerminal={() => desktop.windowManager.openWindow(WINDOW_IDS.TERMINAL)}
                        onOpenTextEditor={() => desktop.windowManager.openWindow(WINDOW_IDS.TEXT_EDITOR)}
                        onOpenPixelGarden={() => desktop.windowManager.openWindow(WINDOW_IDS.PIXEL_GARDEN)}
                        minimizedWindows={minimizedWindows}
                        onRestoreWindow={(id) => desktop.windowManager.toggleMinimize(id)}
                    />

                    <ViewToggleButton />
                </div>
            )}

            <Toaster />
        </>
    );
}
