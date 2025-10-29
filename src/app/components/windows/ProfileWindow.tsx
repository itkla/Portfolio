"use client";

import { memo } from 'react';
import ASCIIText from "@/app/components/effects/ASCIIText/ASCIIText";

export const ProfileWindow = memo(function ProfileWindow() {
    return (
        <ASCIIText
            text="Hunter"
            enableWaves={true}
            asciiFontSize={8}
        />
    );
});
