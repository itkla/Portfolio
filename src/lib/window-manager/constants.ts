export const WINDOW_IDS = {
    PROFILE: 'profile',
    ABOUT: 'about',
    TERMINAL: 'terminal',
    WORKS: 'works',
    TEXT_EDITOR: 'textEditor',
    PIXEL_GARDEN: 'pixelGarden',
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
} as const;

export const DEFAULT_WINDOW_SIZE = {
    WIDTH: 400,
    HEIGHT: 300,
} as const;

export const DEFAULT_WINDOW_POSITION = {
    X: 220,
    Y: 120,
} as const;

export const Z_INDEX = {
    INITIAL: 1,
    INCREMENT: 1,
} as const;

export const SNAP_SETTINGS = {
    THRESHOLD: 30,
    CORNER_THRESHOLD: 15,
} as const;

export const POSITIONING = {
    CASCADE_OFFSET: 30,
    MIN_PADDING: 20,
    GRID_SIZE: 20,
} as const;
