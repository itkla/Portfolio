import React from "react";
import { FaFileCode } from "react-icons/fa6";
import { projects } from "@/data/projects";
import { useTranslations } from "next-intl";

interface WorksWindowProps {
    onClose: () => void;
    onOpenProject: (projectId: string) => void;
}

export function WorksWindow({ onOpenProject }: WorksWindowProps) {
    const t = useTranslations();
    const groupedProjects = projects.reduce((acc, project) => {
        if (!acc[project.category]) {
            acc[project.category] = [];
        }
        acc[project.category].push(project);
        return acc;
    }, {} as Record<string, typeof projects>);

    const categoryOrder: Array<{ key: string; label: string }> = [
        { key: 'fullstack', label: 'Full-Stack' },
        { key: 'backend', label: 'Backend' },
        { key: 'frontend', label: 'Frontend' },
        { key: 'tools', label: 'Tools' },
    ];

    return (
        <div className="p-4 space-y-6">
            {categoryOrder.map(({ key, label }) => {
                const categoryProjects = groupedProjects[key];
                if (!categoryProjects || categoryProjects.length === 0) return null;

                return (
                    <div key={key} className="space-y-3">
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                            {label}
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {categoryProjects.map((project) => (
                                <div
                                    key={project.slug}
                                    className="flex flex-col items-center select-none cursor-pointer"
                                    onDoubleClick={() => onOpenProject(project.slug)}
                                >
                                    <div className="inline-flex flex-col items-center hover:bg-white/5 rounded-lg p-2 transition-colors min-w-[80px]">
                                        <FaFileCode className="w-8 h-8 text-white/70" />
                                        <span className="mt-1 text-white text-xs text-center whitespace-nowrap">
                                            {t(project.titleKey)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
