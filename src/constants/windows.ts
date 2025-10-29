export const WINDOW_IDS = {
    PROFILE: 'profile',
    ABOUT: 'about',
    TERMINAL: 'terminal',
    WORKS: 'works',
    PROJECT_1: 'project1',
    PROJECT_2: 'project2',
    PROJECT_3: 'project3',
    PROJECT_4: 'project4',
    PROJECT_5: 'project5',
    PROJECT_6: 'project6',
    PROJECT_7: 'project7',
    PROJECT_8: 'project8',
    PROJECT_9: 'project9',
    ENCRYPTED_FILE: 'encryptedFile',
    STEAM: 'steamWindow',
    TEXT_EDITOR: 'textEditor',
    PIXEL_GARDEN: 'pixelGarden',
} as const;

export type WindowId = typeof WINDOW_IDS[keyof typeof WINDOW_IDS];

export const DEFAULT_WINDOW_SIZE = {
    WIDTH: 400,
    HEIGHT: 300,
} as const;

export const DEFAULT_WINDOW_POSITION = {
    X: 220,
    Y: 120,
} as const;

export const DESKTOP_ICON_POSITIONS = {
    WORKS: { left: 20, top: 20 },
    ENCRYPTED_FILE: { left: 23, top: 100 },
} as const;
