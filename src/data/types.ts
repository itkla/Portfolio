export interface Project {
    id: string;
    slug: string;
    titleKey: string; // i18n key for title
    category: 'frontend' | 'backend' | 'fullstack' | 'tools';
    status?: 'active' | 'confidential' | 'private';
    statusKey?: string; // i18n key for status
    image: string;
    githubUrl?: string;
    websiteUrl?: string;
    tags: string[];
    descriptionKeys: { // i18n keys
        short: string;
        paragraphs: string[];
    };
    awardKey?: string; // i18n key for award callout
    disclosureKey?: string; // i18n key for disclosure/copyright notice
}

export interface Skill {
    id: string;
    label: string;
    category?: 'language' | 'framework' | 'tool' | 'cloud' | 'design' | 'other';
    special?: boolean;
}

export interface Education {
    year: number;
    titleKey: string; // i18n key
    institution?: string;
}

export interface TerminalCommand {
    command: string;
    outputKey?: string; // i18n key for output
    output?: string | (() => string);
}
