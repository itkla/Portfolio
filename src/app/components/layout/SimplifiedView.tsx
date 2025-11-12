"use client";

import { memo } from 'react';
import { AboutWindow } from '@/app/components/windows';

export const SimplifiedView = memo(function SimplifiedView() {
    return (
        <div className="w-full h-full bg-black overflow-hidden">
            <div className="w-full h-full overflow-y-auto">
                <div className="max-w-5xl mx-auto p-4 md:p-8">
                    <div className=" backdrop-blur-md overflow-hidden shadow-2xl">
                        <AboutWindow />
                    </div>
                </div>
                <div className="block md:hidden py-6 text-center">
                    <p className="text-xs text-gray-400">
                        💡 This site looks way better on a desktop or laptop ;)
                    </p>
                </div>
            </div>
        </div>
    );
});
