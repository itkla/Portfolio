"use client";

import { memo, useMemo } from "react";
import { useTranslations } from 'next-intl';
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
        </>
    );
});
