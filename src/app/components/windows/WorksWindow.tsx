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

    const categoryOrder: Array<{ key: string; label: string; color: string }> = [
        { key: 'fullstack', label: 'Full-Stack', color: '#8b5cf6' },
        { key: 'backend', label: 'Backend', color: '#eab308' },
        { key: 'frontend', label: 'Frontend', color: '#3b82f6' },
        { key: 'tools', label: 'Tools', color: '#10b981' },
    ];

    const totalProjects = projects.length;
    const distribution = categoryOrder.map(category => ({
        ...category,
        count: groupedProjects[category.key]?.length || 0,
        percentage: ((groupedProjects[category.key]?.length || 0) / totalProjects) * 100,
    }));

    return (
        <div className="p-4 space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Works Distribution
                    </h3>
                    <span className="text-xs text-white/30">
                        {totalProjects} {totalProjects === 1 ? 'project' : 'projects'}
                    </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
                    {distribution.map((category, index) => (
                        category.count > 0 && (
                            <div
                                key={category.key}
                                className="relative group transition-all duration-200 hover:opacity-80"
                                style={{
                                    width: `${category.percentage}%`,
                                    backgroundColor: category.color,
                                }}
                                title={`${category.label}: ${category.count} (${category.percentage.toFixed(1)}%)`}
                            />
                        )
                    ))}
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                    {distribution.map((category) => (
                        category.count > 0 && (
                            <div key={category.key} className="flex items-center gap-1.5">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="text-white/60">
                                    {category.label}
                                </span>
                                <span className="text-white/40">
                                    {category.count}
                                </span>
                            </div>
                        )
                    ))}
                </div>
            </div>

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
