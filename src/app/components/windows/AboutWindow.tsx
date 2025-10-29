"use client";

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEnvelope, FaLine, FaInstagram, FaSteam } from 'react-icons/fa';
import DecryptedText from "@/app/components/effects/DecryptedText/DecryptedText";
import { TiltedWrapper } from "@/app/components/ui/TiltedWrapper";
import { skills } from '@/data/skills';
import { education } from '@/data/education';
import { projects } from '@/data/projects';

export const AboutWindow = memo(function AboutWindow() {
    const t = useTranslations();

    return (
        <div className="h-full overflow-y-auto @container">
            <div className="flex flex-col @3xl:flex-row min-h-full">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full @3xl:w-1/3 p-4 @md:p-6 flex flex-col gap-6 @3xl:border-r @3xl:border-dashed @3xl:border-white/20"
                >
                <div className="flex flex-col items-center">
                    <TiltedWrapper
                        rotateAmplitude={8}
                        scaleOnHover={1.03}
                        style={{ display: "inline-block" }}
                    >
                        <div className="relative group max-w-xs w-full">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl p-1">
                                <img
                                    src="/assets/profile.jpg"
                                    alt="Hunter Nakagawa"
                                    className="w-full h-auto rounded-xl object-cover"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-400/0 group-hover:from-blue-500/20 group-hover:to-blue-400/20 blur-xl transition-all duration-500 -z-10" />
                        </div>
                    </TiltedWrapper>
                </div>

                <div className="border-t border-dashed border-white/20" />

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        {t('about.skillsTitle')}
                    </h3>
                    <div className="flex gap-1.5 flex-wrap">
                        {skills.map(skill => (
                            <Badge 
                                key={skill.id} 
                                variant='project_tag'
                                className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 shrink-0"
                            >
                                {skill.special ? (
                                    <DecryptedText speed={100} maxIterations={60} text={skill.label} />
                                ) : (
                                    skill.label
                                )}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        {t('about.educationTitle')}
                    </h3>
                    <div className="space-y-2">
                        {education.map((edu, idx) => (
                            <div 
                                key={idx}
                                className="text-xs text-white/80 bg-white/5 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm break-words"
                            >
                                <div className="font-semibold text-white/90">{edu.year}</div>
                                <div className="text-white/70 mt-0.5">{t(edu.titleKey)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 p-4 @md:p-6 space-y-6 @3xl:border-t-0 border-t border-dashed border-white/20"
            >
                <div className="space-y-1">
                    <h1 className="text-2xl @md:text-3xl @xl:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent break-words">
                        Hunter Nakagawa
                    </h1>
                    <p className="text-base @md:text-lg text-white/60 font-light break-words">
                        Backend/Systems Engineer & Full-Stack Developer
                    </p>
                    
                    <div className="flex gap-3 pt-2">
                        <a 
                            href="https://github.com/itkla"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                            aria-label="GitHub"
                        >
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a 
                            href="https://instagram.com/hunternakagawa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="w-5 h-5" />
                        </a>
                        <a 
                            href="https://line.me/ti/p/hunternakagawa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                            aria-label="LINE"
                        >
                            <FaLine className="w-5 h-5" />
                        </a>
                        <a 
                            href="mailto:hunternakagawa@icloud.com"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                            aria-label="Email"
                        >
                            <FaEnvelope className="w-5 h-5" />
                        </a>
                        {/* <a
                            href="https://steamcommunity.com/id/klaeo"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                            aria-label="Steam"
                        >
                            <FaSteam className="w-5 h-5" />
                        </a> */}
                    </div>
                </div>

                <div className="space-y-4 text-white/80 leading-relaxed">
                    <p className="text-sm break-words">
                        {t('about.bio')}
                    </p>
                    <p className="text-sm italic text-white/60 break-words">
                        {t('about.journey')}
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg @md:text-xl font-semibold text-white/90 break-words">
                        {t('about.whatIDoTitle')}
                    </h2>
                    <div className="space-y-3 text-sm text-white/80 leading-relaxed">
                        <p className="break-words">{t('about.whatIDo1')}</p>
                        <p className="break-words">{t('about.whatIDo2')}</p>
                        <p className="break-words">{t('about.whatIDo3')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg @md:text-xl font-semibold text-white/90 break-words">{t('about.featuredWorkTitle')}</h2>
                        <a 
                            href="https://github.com/itkla"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white/80 transition-colors duration-200"
                            aria-label="See more works"
                        >
                            <FaExternalLinkAlt className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 @xl:grid-cols-2 gap-3">
                        {projects.slice(0, 4).map((project) => (
                            <motion.div
                                key={project.id}
                                whileHover={{ y: -2 }}
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-blue-400/0 group-hover:from-blue-500/10 group-hover:to-blue-400/10 transition-all duration-300 pointer-events-none" />
                                
                                <div className="relative space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-white/90 text-sm flex-1 min-w-0 break-words">
                                            {t(project.titleKey)}
                                        </h3>
                                        {project.status && (
                                            <Badge 
                                                variant={project.status === 'active' ? 'default' : 'secondary'}
                                                className="text-[9px] px-1.5 py-0 shrink-0 whitespace-nowrap"
                                            >
                                                {t(project.statusKey!)}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed break-words overflow-hidden">
                                        {t(project.descriptionKeys.short)}
                                    </p>
                                    <div className="flex gap-2 pt-1">
                                        {project.githubUrl && (
                                            <a 
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/40 hover:text-white/80 transition-colors"
                                            >
                                                <FaGithub className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {project.websiteUrl && (
                                            <a 
                                                href={project.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/40 hover:text-white/80 transition-colors"
                                            >
                                                <FaExternalLinkAlt className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg @md:text-xl font-semibold text-white/90 break-words">
                            Let's make something great
                        </h2>
                        <a 
                            href="mailto:hunternakagawa@icloud.com"
                            className="flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 text-white/90 bg-white/20 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/30 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap shadow-lg"
                        >
                            <FaEnvelope className="w-4 h-4" />
                            {t('about.getInTouch')}
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
        </div>
    );
});
