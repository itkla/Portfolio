import React from "react";
import { MacWindow } from "@/app/components/MacWindow";
import { FaFileCode } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa6";

interface WorksWindowProps {
    onClose: () => void;
    onOpenProject: (projectId: string) => void;
}

export function WorksWindow({ onClose, onOpenProject }: WorksWindowProps) {
    const projects = [
        { id: "project1", title: "Checkpoint", icon: <FaFileCode className="w-8 h-8" /> },
        { id: "project2", title: "HAL Boulangerie", icon: <FaFileCode className="w-8 h-8" /> },
        { id: "project3", title: "Concierge", icon: <FaFileCode className="w-8 h-8" /> },
        { id: "project4", title: "高田馬場ファイターズ", icon: <FaFileCode className="w-8 h-8" /> },
        { id: "project5", title: "Portfolio", icon: <FaFileCode className="w-8 h-8" /> },
        // etc.
    ];

    return (
        <div className="grid grid-cols-3 gap-4 p-2">
            {projects.map((proj) => (
                <div
                    key={proj.id}
                    className="flex flex-col items-center select-none cursor-pointer"
                    onDoubleClick={() => onOpenProject(proj.id)}
                >
                    {proj.icon}
                    <span className="mt-1 text-white text-xs">{proj.title}</span>
                </div>
            ))}
        </div>
    );
}