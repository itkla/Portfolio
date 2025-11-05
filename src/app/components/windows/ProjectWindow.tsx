"use client";

import { memo, useMemo } from "react";
import { useTranslations } from 'next-intl';
import { Trophy } from 'lucide-react';
import { projects } from '@/data/projects';
import { ProjectHeader, ProjectImage, ProjectDescription, ProjectTags } from '@/app/components/projects';

interface ProjectWindowProps {
    projectSlug: string;
}

export const ProjectWindow = memo(function ProjectWindow({ projectSlug }: ProjectWindowProps) {
    const t = useTranslations();
    const project = useMemo(() => projects.find(p => p.slug === projectSlug), [projectSlug]);

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <>
            <ProjectHeader project={project} />
            {project.awardKey && (
                <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            <span className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-400 rounded-full animate-sparkle-1" />
                            <span className="absolute top-0 -left-1 w-1 h-1 bg-amber-400 rounded-full animate-sparkle-2" />
                            <span className="absolute -bottom-1 right-0 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-sparkle-3" />
                            <span className="absolute bottom-1 -left-1 w-0.5 h-0.5 bg-amber-300 rounded-full animate-sparkle-4" />
                        </div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            {t(project.awardKey)}
                        </p>
                    </div>
                </div>
            )}
            {project.image && (
                <ProjectImage
                    src={project.image}
                    alt={t(project.titleKey)}
                />
            )}
            <ProjectDescription
                shortDescriptionKey={project.descriptionKeys.short}
                paragraphKeys={project.descriptionKeys.paragraphs}
            />
            <ProjectTags tags={project.tags} />
            {project.disclosureKey && (
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 italic">
                    {t(project.disclosureKey)}
                </p>
            )}
        </>
    );
});
