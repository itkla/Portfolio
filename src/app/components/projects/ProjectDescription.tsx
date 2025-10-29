"use client";

import { useTranslations } from 'next-intl';

interface ProjectDescriptionProps {
    shortDescriptionKey: string;
    paragraphKeys: string[];
}

export function ProjectDescription({
    shortDescriptionKey,
    paragraphKeys
}: ProjectDescriptionProps) {
    const t = useTranslations();

    return (
        <div>
            <p className="mt-2">{t(shortDescriptionKey)}</p>
            {paragraphKeys.map((key, idx) => (
                <p key={idx} className="mt-2">
                    {t(key)}
                </p>
            ))}
        </div>
    );
}
