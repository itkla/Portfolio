export interface Award {
    year: number;
    titleKey: string;
    project: string;
}

export const awards: Award[] = [
    { year: 2025, titleKey: 'about.awards.kadai05', project: 'kadai05' },
    { year: 2026, titleKey: 'about.awards.kadai10', project: 'kadai10' },
    { year: 2026, titleKey: 'about.awards.tokyosounds', project: 'tokyosounds' },
];
