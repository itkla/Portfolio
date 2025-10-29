"use client";

import { memo } from 'react';
import { useWindowStore } from '@/lib/window-manager/store';
import { Switch } from '@/components/ui/switch';

export const ViewToggleButton = memo(function ViewToggleButton() {
    const viewMode = useWindowStore((state) => state.viewMode);
    const toggleViewMode = useWindowStore((state) => state.toggleViewMode);

    const isSimplified = viewMode === 'simplified';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-xs opacity-75">
            <span className={!isSimplified ? 'text-white' : 'text-gray-500'}>
                desktop
            </span>
            
            <Switch 
                checked={isSimplified}
                onCheckedChange={toggleViewMode}
                aria-label={isSimplified ? "Switch to desktop view" : "Switch to simplified view"}
            />
            
            <span className={isSimplified ? 'text-white' : 'text-gray-500'}>
                simple
            </span>
        </div>
    );
});
