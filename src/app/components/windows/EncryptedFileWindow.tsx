"use client";

import { memo } from "react";
import { useTranslations } from 'next-intl';

export const EncryptedFileWindow = memo(function EncryptedFileWindow() {
    const t = useTranslations();

    return (
        <>
            <h1 className="text-lg font-bold">{t('encryptedFile.title')}</h1>
            <div className="encrypted">
                {t('encryptedFile.content')}
            </div>
        </>
    );
});
