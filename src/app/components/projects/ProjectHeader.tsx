"use client";

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { FaGithub, FaGlobe } from "react-icons/fa6";
import type { Project } from '@/data/types';

interface ProjectHeaderProps {
    project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const t = useTranslations();

    return (
        <div>
            <h1 className="text-lg font-bold">
                {t(project.titleKey)}
                {project.statusKey && (
                    <> <Badge>{t(project.statusKey)}</Badge></>
                )}
            </h1>
            <div className="flex gap-2">
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                    >
                        <FaGithub /> {t('links.repository')}
                    </a>
                )}
                {project.websiteUrl && (
                    <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                    >
                        <FaGlobe /> {t('links.website')}
                    </a>
                )}
            </div>
        </div>
    );
}
