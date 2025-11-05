import type { WindowId, WindowConfig, WindowRenderContext } from './types';
import { WINDOW_IDS } from './constants';
import {
    ProfileWindow,
    TerminalWindow,
    AboutWindow,
    WorksWindow,
    EncryptedFileWindow,
    ProjectWindow,
    TextEditorWindow,
    PixelGardenWindow,
} from '@/app/components/windows';
import {
    FaUser,
    FaTerminal,
    FaIdCard,
    FaFolder,
    FaLock,
    FaFile,
    FaFileLines
} from 'react-icons/fa6';
import { Flower2 } from 'lucide-react';

export const WINDOW_REGISTRY: Record<WindowId, WindowConfig> = {
    [WINDOW_IDS.PROFILE]: {
        id: WINDOW_IDS.PROFILE,
        titleKey: 'windows.profile',
        icon: <FaUser size={18} />,
        defaultSize: { width: 800, height: 400 },
        defaultPosition: 'center',
        openOnMount: true,
        render: () => <ProfileWindow />,
    },

    [WINDOW_IDS.TERMINAL]: {
        id: WINDOW_IDS.TERMINAL,
        titleKey: 'windows.terminal',
        icon: <FaTerminal size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: (ctx: WindowRenderContext) => (
            <TerminalWindow
                command={ctx.terminal?.command || ''}
                setCommand={ctx.terminal?.setCommand || (() => { })}
                history={ctx.terminal?.history || []}
                onExecuteCommand={ctx.terminal?.executeCommand || (() => { })}
                currentDir={ctx.terminal?.currentDir || '/home/guest'}
            />
        ),
    },

    [WINDOW_IDS.TEXT_EDITOR]: {
        id: WINDOW_IDS.TEXT_EDITOR,
        titleKey: 'windows.textEditor',
        icon: <FaFileLines size={18} />,
        defaultSize: { width: 600, height: 500 },
        defaultPosition: 'cascade',
        render: () => <TextEditorWindow />,
    },

    [WINDOW_IDS.PIXEL_GARDEN]: {
        id: WINDOW_IDS.PIXEL_GARDEN,
        titleKey: 'windows.pixelGarden',
        icon: <Flower2 size={18} />,
        defaultSize: { width: 600, height: 700 },
        defaultPosition: 'cascade',
        render: () => <PixelGardenWindow />,
    },

    [WINDOW_IDS.ABOUT]: {
        id: WINDOW_IDS.ABOUT,
        titleKey: 'windows.about',
        icon: <FaIdCard size={18} />,
        defaultSize: { width: 800, height: 500 },
        defaultPosition: 'cascade',
        render: () => <AboutWindow />,
    },

    [WINDOW_IDS.WORKS]: {
        id: WINDOW_IDS.WORKS,
        titleKey: 'windows.works',
        icon: <FaFolder size={18} />,
        defaultSize: { width: 600, height: 400 },
        defaultPosition: { x: 100, y: 100 },
        render: (ctx: WindowRenderContext) => (
            <WorksWindow
                onClose={() => ctx.closeWindow(WINDOW_IDS.WORKS)}
                onOpenProject={(projectId: string) => ctx.openWindow(projectId as WindowId)}
            />
        ),
    },

    [WINDOW_IDS.ENCRYPTED_FILE]: {
        id: WINDOW_IDS.ENCRYPTED_FILE,
        titleKey: 'windows.encryptedFile',
        icon: <FaLock size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <EncryptedFileWindow />,
    },

    [WINDOW_IDS.PROJECT_1]: {
        id: WINDOW_IDS.PROJECT_1,
        titleKey: 'projects.checkpoint.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project1" />,
    },

    [WINDOW_IDS.PROJECT_2]: {
        id: WINDOW_IDS.PROJECT_2,
        titleKey: 'projects.boulangerie.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project2" />,
    },

    [WINDOW_IDS.PROJECT_3]: {
        id: WINDOW_IDS.PROJECT_3,
        titleKey: 'projects.concierge.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project3" />,
    },

    [WINDOW_IDS.PROJECT_4]: {
        id: WINDOW_IDS.PROJECT_4,
        titleKey: 'projects.takadanobaba.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project4" />,
    },

    [WINDOW_IDS.PROJECT_5]: {
        id: WINDOW_IDS.PROJECT_5,
        titleKey: 'projects.portfolio.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project5" />,
    },

    [WINDOW_IDS.PROJECT_6]: {
        id: WINDOW_IDS.PROJECT_6,
        titleKey: 'projects.receptionist.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project6" />,
    },

    [WINDOW_IDS.PROJECT_7]: {
        id: WINDOW_IDS.PROJECT_7,
        titleKey: 'projects.bob.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project7" />,
    },

    [WINDOW_IDS.PROJECT_8]: {
        id: WINDOW_IDS.PROJECT_8,
        titleKey: 'projects.jot.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project8" />,
    },

    [WINDOW_IDS.PROJECT_9]: {
        id: WINDOW_IDS.PROJECT_9,
        titleKey: 'projects.aer.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project9" />,
    },

    [WINDOW_IDS.PROJECT_10]: {
        id: WINDOW_IDS.PROJECT_10,
        titleKey: 'projects.kadai05.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project10" />,
    },

    [WINDOW_IDS.PROJECT_11]: {
        id: WINDOW_IDS.PROJECT_11,
        titleKey: 'projects.kadai07.title',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <ProjectWindow projectSlug="project11" />,
    },

    [WINDOW_IDS.STEAM]: {
        id: WINDOW_IDS.STEAM,
        titleKey: 'windows.steam',
        icon: <FaFile size={18} />,
        defaultSize: { width: 400, height: 300 },
        defaultPosition: 'cascade',
        render: () => <div>Steam Window Placeholder</div>,
    },
};
