import { useMemo } from 'react';
import type { Variants } from 'framer-motion';

export interface WindowAnimationConfig {
    initial: Record<string, number | string | boolean>;
    animate: Record<string, number | string | boolean>;
    exit: Record<string, number | string | boolean>;
    transition: Record<string, number | string | boolean | object>;
}

export function useWindowAnimations() {
    const variants: Variants = useMemo(() => ({
        initial: {
            opacity: 0,
            scale: 0.8,
            y: 20,
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
                mass: 0.8,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -10,
            transition: {
                duration: 0.2,
                ease: 'easeInOut',
            },
        },
    }), []);

    const minimizeVariants: Variants = useMemo(() => ({
        minimized: {
            scale: 0.1,
            opacity: 0,
            y: window.innerHeight,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
        normal: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25,
            },
        },
    }), []);

    const maximizeVariants: Variants = useMemo(() => ({
        normal: {
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
            },
        },
        maximized: {
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
            },
        },
    }), []);

    return {
        variants,
        minimizeVariants,
        maximizeVariants,
    };
}

export const WINDOW_ANIMATIONS = {
    default: {
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -10 },
        transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    slide: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
    },
    bounce: {
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.3 },
        transition: { type: 'spring', stiffness: 400, damping: 20 },
    },
} as const;
