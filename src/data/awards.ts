export interface Award {
    year: number;
    awardKey: string;
    projectNameKey: string;
    slug: string;
}

export const awards: Award[] = [
    { year: 2025, awardKey: 'about.awards.kadai05.award', projectNameKey: 'about.awards.kadai05.project', slug: 'project10' },
    { year: 2026, awardKey: 'about.awards.kadai10.award', projectNameKey: 'about.awards.kadai10.project', slug: 'project15' },
    { year: 2026, awardKey: 'about.awards.tokyosounds.award', projectNameKey: 'about.awards.tokyosounds.project', slug: 'project16' },
];
