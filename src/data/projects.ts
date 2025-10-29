import { Project } from './types';

export const projects: Project[] = [
    {
        id: 'checkpoint',
        slug: 'project1',
        titleKey: 'projects.checkpoint.title',
        category: 'fullstack',
        status: 'active',
        statusKey: 'projects.checkpoint.status',
        image: '/assets/checkpoint.png',
        githubUrl: 'https://github.com/itkla/Checkpoint',
        tags: ['nextjs', 'postgresql', 'typescript', 'redis', 'argon2id', 'tailwind', 'fastify', 'jwt'],
        descriptionKeys: {
            short: 'projects.checkpoint.short',
            paragraphs: [
                'projects.checkpoint.description',
                'projects.checkpoint.solution',
            ],
        },
    },
    {
        id: 'bob',
        slug: 'project7',
        titleKey: 'projects.bob.title',
        category: 'backend',
        status: 'active',
        statusKey: 'projects.bob.status',
        image: '',
        githubUrl: 'https://github.com/itkla/Bob',
        tags: ['rust', 's3', 'gcs', 'azure', 'b2', 'storage'],
        descriptionKeys: {
            short: 'projects.bob.short',
            paragraphs: [
                'projects.bob.description',
                'projects.bob.features',
            ],
        },
    },
    {
        id: 'jot',
        slug: 'project8',
        titleKey: 'projects.jot.title',
        category: 'tools',
        status: 'active',
        statusKey: 'projects.jot.status',
        image: '',
        githubUrl: 'https://github.com/itkla/Jot',
        tags: ['tauri', 'rust', 'html5', 'css', 'js'],
        descriptionKeys: {
            short: 'projects.jot.short',
            paragraphs: [
                'projects.jot.description',
                'projects.jot.philosophy',
            ],
        },
    },
    {
        id: 'aer',
        slug: 'project9',
        titleKey: 'projects.aer.title',
        category: 'tools',
        status: 'private',
        statusKey: 'projects.aer.status',
        image: '',
        tags: ['webrtc', 'p2p', 'typescript', 'tauri', 'rust'],
        descriptionKeys: {
            short: 'projects.aer.short',
            paragraphs: [
                'projects.aer.description',
                'projects.aer.technical',
            ],
        },
    },
    {
        id: 'receptionist',
        slug: 'project6',
        titleKey: 'projects.receptionist.title',
        category: 'fullstack',
        image: '',
        githubUrl: 'https://github.com/itkla/Receptionist',
        tags: ['nextjs', 'typescript', 'postgresql', 'prisma', 'nextauth', 'tailwind', 'shadcn', 'resend'],
        descriptionKeys: {
            short: 'projects.receptionist.short',
            paragraphs: [
                'projects.receptionist.description',
                'projects.receptionist.features',
            ],
        },
    },
    {
        id: 'boulangerie',
        slug: 'project2',
        titleKey: 'projects.boulangerie.title',
        category: 'frontend',
        image: '/assets/boulangerie.png',
        githubUrl: 'https://github.com/buhworld/HAL/tree/main/WD16/Boulangerie',
        tags: ['html5', 'jquery', 'css', 'js', 'tailwind'],
        descriptionKeys: {
            short: 'projects.boulangerie.short',
            paragraphs: [
                'projects.boulangerie.description',
            ],
        },
    },
    {
        id: 'concierge',
        slug: 'project3',
        titleKey: 'projects.concierge.title',
        category: 'fullstack',
        status: 'confidential',
        statusKey: 'projects.concierge.status',
        image: '',
        tags: ['typescript', 'nodejs', 'react', 'bootstrap', 'express'],
        descriptionKeys: {
            short: 'projects.concierge.short',
            paragraphs: [
                'projects.concierge.description',
                'projects.concierge.confidential',
            ],
        },
    },
    {
        id: 'takadanobaba',
        slug: 'project4',
        titleKey: 'projects.takadanobaba.title',
        category: 'frontend',
        image: '/assets/takadanobaba.png',
        githubUrl: 'https://github.com/Deep-Shinjuku/Takadanobaba',
        websiteUrl: 'https://deep-shinjuku.github.io/Mayu/takadanobaba.html',
        tags: ['pixijs', 'html5', 'css', 'js', 'tailwind'],
        descriptionKeys: {
            short: 'projects.takadanobaba.short',
            paragraphs: [
                'projects.takadanobaba.description',
                'projects.takadanobaba.timeline',
            ],
        },
    },
    {
        id: 'portfolio',
        slug: 'project5',
        titleKey: 'projects.portfolio.title',
        category: 'frontend',
        image: '/assets/portfolio.png',
        githubUrl: 'https://github.com/itkla/portfolio',
        websiteUrl: 'https://klae.ooo',
        tags: ['nextjs', 'tailwind', 'gsap', 'framer-motion', 'threejs', 'typescript', 'react'],
        descriptionKeys: {
            short: 'projects.portfolio.short',
            paragraphs: [
                'projects.portfolio.description',
                'projects.portfolio.design',
                'projects.portfolio.secrets',
            ],
        },
    },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
    return projects.find(p => p.slug === slug);
};

export const getProjectById = (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
};
