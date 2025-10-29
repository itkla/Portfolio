"use client";

import React, { memo, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, FileText } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TextEditorWindow = memo(function TextEditorWindow() {
    const t = useTranslations();
    const [content, setContent] = useState("");
    const [filename, setFilename] = useState("untitled.txt");
    const [isModified, setIsModified] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setIsModified(true);
    }, []);

    const handleOpenFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setContent(text);
            setFilename(file.name);
            setIsModified(false);
        };
        reader.readAsText(file);

        e.target.value = "";
    }, []);

    const handleSave = useCallback(() => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsModified(false);
    }, [content, filename]);

    const handleSaveAs = useCallback(() => {
        const newFilename = prompt(t("textEditor.saveAsPrompt"), filename);
        if (!newFilename) return;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = newFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setFilename(newFilename);
        setIsModified(false);
    }, [content, filename, t]);

    const handleNewFile = useCallback(() => {
        if (isModified) {
            const confirmed = confirm(t("textEditor.unsavedChanges"));
            if (!confirmed) return;
        }
        setContent("");
        setFilename("untitled.txt");
        setIsModified(false);
    }, [isModified, t]);

    return (
        <div className="flex flex-col h-full bg-transparent rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-700/50">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800/50 rounded-md transition-colors outline-none">
                        <FileText className="w-3.5 h-3.5" />
                        <span>File</span>
                        <ChevronDown className="w-3 h-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-neutral-700/50 rounded-lg"
                    >
                        <DropdownMenuItem
                            onClick={handleNewFile}
                            className="text-xs text-neutral-300 focus:bg-neutral-800/50 focus:text-neutral-100 cursor-pointer rounded-md"
                        >
                            {t("textEditor.new")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleOpenFile}
                            className="text-xs text-neutral-300 focus:bg-neutral-800/50 focus:text-neutral-100 cursor-pointer rounded-md"
                        >
                            {t("textEditor.open")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-neutral-700/50" />
                        <DropdownMenuItem
                            onClick={handleSave}
                            className="text-xs text-neutral-300 focus:bg-neutral-800/50 focus:text-neutral-100 cursor-pointer rounded-md"
                        >
                            {t("textEditor.save")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleSaveAs}
                            className="text-xs text-neutral-300 focus:bg-neutral-800/50 focus:text-neutral-100 cursor-pointer rounded-md"
                        >
                            {t("textEditor.saveAs")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span>{filename}</span>
                    {isModified && <span className="text-yellow-500">•</span>}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="text/*,.txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html,.xml,.csv"
                onChange={handleFileSelect}
                className="hidden"
            />

            <textarea
                value={content}
                onChange={handleContentChange}
                className="flex-1 p-4 font-mono text-sm resize-none outline-none bg-transparent text-white placeholder:text-neutral-600 rounded-lg"
                placeholder={t("textEditor.placeholder")}
                spellCheck={false}
            />

            <div className="flex items-center justify-between px-3 py-1.5 border-t border-neutral-700/50 text-xs text-neutral-500 rounded-b-lg">
                <span>
                    {content.split("\n").length} {t("textEditor.lines")} | {content.length} {t("textEditor.characters")}
                </span>
                <span>Plain Text</span>
            </div>
        </div>
    );
});
