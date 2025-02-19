"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/app/components/Footer";
import { MacWindow } from "@/app/components/MacWindow";
import { WorksWindow } from "@/app/components/WorksWindow";
import { DesktopIcon } from "@/app/components/DesktopIcon";
import { FaFolder, FaGithub, FaLock, FaGamepad, FaGlobe } from "react-icons/fa6";
import { Badge } from '@/components/ui/badge';
// import {  } from 'react-icons/fa6';
import ScrollFloat from '@/app/components/ScrollFloat/ScrollFloat';
import ASCIIText from "@/app/components/ASCIIText/ASCIIText";
import DecryptedText from "@/app/components/DecryptedText/DecryptedText";
import StarBorder from '@/app/components/StarBorder/StarBorder';
import CircularText from "@/app/components/CircularText/CircularText";
import { Form } from "@/components/ui/form";
import { TiltedWrapper } from "@/app/components/TiltedWrapper";
import { HawaiiLicenseCard } from "@/app/components/HawaiiLicenseCard";
import GradientText from "@/app/components/GradientText/GradientText";
import ClickSpark from "@/app/components/ClickSpark/ClickSpark";

import { Scroll } from "lucide-react";
import { set } from "react-hook-form";

// import '@/components/ui/badge.css';

interface WindowData {
    id: string;
    title: string;
    isOpen: boolean;
    zIndex: number;
    defaultX?: number;
    defaultY?: number;
    defaultWidth?: number;
    defaultHeight?: number;
}

export default function Home() {
    const [windowSize, setWindowSize] = useState({ innerWidth: 0, innerHeight: 0 });
        useEffect(() => {
            const size = {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
            };
            setWindowSize(size);
            console.log(size);
            openWindow("profile");
        }, []);
    const [windows, setWindows] = useState<WindowData[]>([
        {
            id: "profile",
            title: "Profile",
            isOpen: true,
            zIndex: 1, // start with 1
            defaultHeight: 400,
            defaultWidth: 800,
            defaultX: windowSize.innerWidth ? windowSize.innerWidth / 2 - 800 / 2 : undefined,
            defaultY: windowSize.innerHeight ? windowSize.innerHeight / 2 - 400 / 2 : undefined,
        },
        {
            id: "about",
            title: "About",
            isOpen: false,
            zIndex: 2, // or 0 if it's closed initially
        },
        {
            id: "terminal",
            title: "Terminal",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "works",
            title: "Works",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "project1",
            title: "Checkpoint",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "project2",
            title: "HAL Boulangerie",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "project3",
            title: "Concierge",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "project4",
            title: "高田馬場ファイターズ",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "project5",
            title: "Portfolio",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "encryptedFile",
            title: "super_secret_file.txt",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        },
        {
            id: "steamWindow",
            title: "steampowered.com",
            isOpen: false,
            zIndex: 0, // or 0 if it's closed initially
        }
    ]);
    const [nextZIndex, setNextZIndex] = useState(3);
    const [command, setCommand] = React.useState("");
    const [terminalHistory, setTerminalHistory] = React.useState<(string | React.ReactElement)[]>([]);

    // Callback to open a window (when user clicks Dock)
    function openWindow(id: string) {
        setWindows((prev) =>
            prev.map((w) => {
                if (w.id === id) {
                    return { ...w, isOpen: true, zIndex: nextZIndex };
                }
                return w;
            })
        );
        setNextZIndex((z) => z + 1);
    }

    // Callback to close a window
    function closeWindow(id: string) {
        setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
    }

    // Callback to bring a window to front (focus)
    function bringToFront(id: string) {
        setWindows((prev) =>
            prev.map((w) => {
                if (w.id === id) {
                    // bump zIndex to nextZIndex
                    return { ...w, zIndex: nextZIndex };
                }
                return w;
            })
        );
        // increment the global zIndex
        setNextZIndex((z) => z + 1);
    }

    function renderWindowContent(id: string) {
        switch (id) {
            case "profile":
                return <>
                    <ASCIIText
                        text="Hunter"
                        enableWaves={true}
                        asciiFontSize={8}
                    />
                </>
            case "terminal":
                return (() => {

                    const processCommand = (cmd: string) => {
                        const trimmed = cmd.trim();
                        if (!trimmed) return "";
                        switch (trimmed) {
                            case "help":
                                return "Available commands: help, echo [text], clear, ls, cat [file], ping, whoami, date, time, crypto";
                            case "ping":
                                return "Pong!";
                            case "clear":
                                return "";
                            case "whoami":
                                return "Guest";
                            case "date":
                                return new Date().toLocaleDateString();
                            case "time":
                                return new Date().toLocaleTimeString();
                            case "ls":
                                return "profile.txt about.txt projects.txt";
                            case "cat profile.txt":
                                return "Hunter Nakagawa\nBackend/systems engineer and full-stack developer.";
                            case "cat about.txt":
                                return "Born and raised in Hawai'i, I moved to Japan to pursue further education and expand my horizons. Among other things, I sought to expand my portfolio, learn new skills, and sample a different culture and language.";
                            case "cat projects.txt":
                                return "Projects: Checkpoint, HAL Boulangerie, Concierge, 高田馬場ファイターズ, Portfolio";
                            case "crypto":
                                return "btc eth usdc doge";
                            case "crypto btc":
                                return "3Kme8iqa7vfPXovpTTSvKjeAD3comiEHNK";
                            case "crypto eth":
                                return "0xDB353e0701381BF45383000Ee9062C83D3934665";
                            case "crypto usdc":
                                return "0xAF68234be3882e482cc809987975294Ad1AB5c24";
                            case "crypto doge":
                                return "DQZ4fhAHpMCvqnNRSFwEoQ4bmEskX9bXej";
                            case "login admin":
                                const password = trimmed.slice(6);
                                if (password === "password") {
                                    return "Welcome, admin.";
                                }
                                return "Incorrect password.";
                            default:
                                if (trimmed.startsWith("echo ")) {
                                    return trimmed.slice(5);
                                }
                                if (trimmed.startsWith("cat ")) {
                                    return "File not found.";
                                }
                                return "Unknown command. Type 'help' for a list of commands.";
                        }
                    };

                    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                            if (command.trim() === "clear") {
                                setTerminalHistory([]);
                            } else {
                                const output = processCommand(command);
                                setTerminalHistory((prev) => [...prev, `$ ${command}`, output]);
                            }
                            setCommand("");
                        }
                    };

                    return (
                        <div className="p-4 text-green-400 font-mono h-full overflow-auto">
                            {terminalHistory.map((item, idx) =>
                                React.isValidElement(item) ? (
                                    <React.Fragment key={idx}>{item}</React.Fragment>
                                ) : (
                                    <p key={idx}>{item}</p>
                                )
                            )}
                            <div className="flex">
                                <span>$ </span>
                                <input
                                    type="text"
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent text-green-400 outline-none flex-1"
                                    autoFocus
                                />
                            </div>
                        </div>
                    );
                })();
            case "about":
                return <>
                    <div className="flex justify-center items-center">
                        <TiltedWrapper
                            rotateAmplitude={5}    // Subtle tilt
                            scaleOnHover={1.02}    // Slight scale on hover
                            style={{
                                display: "inline-block",
                            }}
                        >
                            <GradientText
                                children={<HawaiiLicenseCard />}
                                showBorder={true}
                                colors={[
                                    "#E57373", // muted red
                                    "#FFB74D", // muted orange
                                    "#FFF176", // muted yellow
                                    "#81C784", // muted green
                                    "#64B5F6", // muted blue
                                    "#9575CD", // muted indigo
                                    "#F48FB1"  // muted violet
                                ]}
                                animationSpeed={5}
                            />
                        </TiltedWrapper>

                        {/* <HawaiiLicenseCard /> */}
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-bold">About</h2>
                        <p className="mt-2">Born and raised in Hawai&apos;i, I moved to Japan to pursue further education and expand my horizons. Among other things, I sought to expand my portfolio, learn new skills, and sample a different culture and language.</p>
                        <p className="mt-2">I ended up loving it.</p>
                        <h2 className="text-lg font-bold mt-4">What I do</h2>
                        <p className="mt-2">I'm a backend/systems engineer and full-stack developer with a penchant for clean, efficient, and modern code. I'm also a fan of minimalism, whitespace, and simple design principles.</p>
                        <p className="mt-2">I'm currently working on a few projects, including a modern authentication system, a personal website, and a few other things that I can't disclose yet.</p>
                        <p className="mt-2">If you ever need someone who can see a whole project through, front and back, you know where to find me.</p>
                        <h2 className="text-lg font-bold mt-4">Skills</h2>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant='project_tag'>#javascript</Badge>
                            <Badge variant='project_tag'>#nodejs</Badge>
                            <Badge variant='project_tag'>#typescript</Badge>
                            <Badge variant='project_tag'>#react</Badge>
                            <Badge variant='project_tag'>#nextjs</Badge>
                            <Badge variant='project_tag'>#postgresql</Badge>
                            <Badge variant='project_tag'>#redis</Badge>
                            <Badge variant='project_tag'>#tailwind</Badge>
                            <Badge variant='project_tag'>#fastify</Badge>
                            <Badge variant='project_tag'>#jwt</Badge>
                            <Badge variant='project_tag'>#php</Badge>
                            <Badge variant='project_tag'>#python</Badge>
                            <Badge variant='project_tag'>#java</Badge>
                            <Badge variant='project_tag'>#c++</Badge>
                            <Badge variant='project_tag'>#mysql</Badge>
                            <Badge variant='project_tag'>#docker</Badge>
                            <Badge variant='project_tag'>#dns</Badge>
                            <Badge variant='project_tag'>#linux</Badge>
                            <Badge variant='project_tag'><DecryptedText speed={100} maxIterations={60} text="#encryption" /></Badge>
                            <Badge variant='project_tag'>#aws</Badge>
                            <Badge variant='project_tag'>#gcp</Badge>
                            <Badge variant='project_tag'>#english</Badge>
                            <Badge variant='project_tag'>#日本語</Badge>
                            <Badge variant='project_tag'>#figma</Badge>
                            <Badge variant='project_tag'>#photoshop</Badge>
                            <Badge variant='project_tag'>#hardware</Badge>

                        </div>
                        <h2 className="text-lg font-bold mt-4">Education</h2>
                        <ul>
                            <li>2015 - CompTIA A+ Certification</li>
                            <li>2021 - University of Hawai'i</li>
                            <li>2024 - ISIランゲージスクール</li>
                            <li>2024 - CG-Arts Webデザイナー ベーシック検定</li>
                            <li>2024 - Google Project Management Certificate</li>
                            <li>2026 - HAL東京</li>
                        </ul>
                    </div>
                </>
            case "works":
                return <WorksWindow
                    onClose={() => closeWindow("works")}
                    onOpenProject={(pid) => openWindow(pid)}
                />;
            case "encryptedFile":
                return <>
                    <h1 className="text-lg font-bold">???</h1>
                    {/* <DecryptedText speed={100} maxIterations={60} encryptedClassName="encrypted" /> */}
                    <div className="encrypted">
                        This is a secret file.
                    </div>
                </>;
            case "project1":
                return <>
                    <h1 className="text-lg font-bold">Checkpoint <Badge>Active</Badge></h1>
                    <a
                        href="https://github.com/itkla/Checkpoint"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                    >
                        <FaGithub /> Repository
                    </a>
                    <img src="/assets/checkpoint.png" alt="Checkpoint" className="w-full mt-2 rounded-xl" />
                    <p className="mt-2">Purpose-built authentication and identity management system built for the modern era.</p>
                    <p className="mt-2">I'm building Checkpoint because I believe that Japan's authentication standards are subpar, and exposes private information as a consequence. So, my solution is to a. encourage companies and organizations to defer authentication and management to a purpose-built platform, and b. hash, encrypt, and store client information securely.</p>
                    <p className="mt-2">
                        Thus, Checkpoint was born.
                    </p>
                    <div className=" rounded-xl border-neutral-700 p-2 mt-2">
                        <h2 className="text-sm font-bold"></h2>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant='project_tag'>#nextjs</Badge>
                            <Badge variant='project_tag'>#postgresql</Badge>
                            <Badge variant='project_tag'>#typescript</Badge>
                            <Badge variant='project_tag'>#redis</Badge>
                            <Badge variant='project_tag'>#argon2id</Badge>
                            <Badge variant='project_tag'>#tailwind</Badge>
                            <Badge variant='project_tag'>#fastify</Badge>
                            <Badge variant='project_tag'>#jwt</Badge>
                        </div>
                    </div>
                </>;
            case "project2":
                return <>
                    <h1 className="text-lg font-bold">HAL Boulangerie</h1>
                    <a
                        href="https://github.com/buhworld/HAL/tree/main/WD16/Boulangerie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                    >
                        <FaGithub /> Repository
                    </a>
                    <img src="/assets/boulangerie.png" alt="HAL Boulangerie" className="w-full mt-2 rounded-xl" />
                    <p className="mt-2">A webpage built for an assignment. Due to the restrictions in place, I was only able to design and produce the site in basic HTML, JS, and Tailwind.</p>
                    <p className="mt-2">The website showcases my affinity for simple and modern design principles, where bold colors, whitespace, and minimal aesthetics are allowed to breathe.</p>
                    <div className=" rounded-xl border-neutral-700 p-2 mt-2">
                        <h2 className="text-sm font-bold"></h2>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant='project_tag'>#html5</Badge>
                            <Badge variant='project_tag'>#jquery</Badge>
                            <Badge variant='project_tag'>#css</Badge>
                            <Badge variant='project_tag'>#js</Badge>
                            <Badge variant='project_tag'>#tailwind</Badge>
                        </div>
                    </div>
                </>;
            case "project3":
                return <>
                    <h1 className="text-lg font-bold">Concierge <Badge>Confidential</Badge></h1>
                    {/* <img src="/assets/boulangerie.png" alt="HAL Boulangerie" className="w-full mt-2 rounded-xl" /> */}
                    <p className="mt-2">An inventory management and device orchestration platform built for the Hawaii State Department of Education during my employment there.</p>
                    <p className="mt-2">Because of the archaic nature of the existing toolset, an upgrade was desperately needed. What would've taken us weeks or months to deploy 1,000+ mobile devices had now taken only days.</p>
                    <p className="mt-2">Because this project was built under contract, I am not able to disclose the codebase or the infrastructure that it is connected to.</p>
                    <div className=" rounded-xl border-neutral-700 p-2 mt-2">
                        <h2 className="text-sm font-bold"></h2>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant='project_tag'>#typescript</Badge>
                            <Badge variant='project_tag'>#nodejs</Badge>
                            <Badge variant='project_tag'>#react</Badge>
                            <Badge variant='project_tag'>#bootstrap</Badge>
                            <Badge variant='project_tag'>#express</Badge>
                        </div>
                    </div>
                </>;
            case "project4":
                return <>
                    <h1 className="text-lg font-bold">高田馬場ファイターズ</h1>
                    <a
                        href="https://github.com/Deep-Shinjuku/Takadanobaba"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                    >
                        <FaGithub /> Repository
                    </a>
                    <a
                        href="https://deep-shinjuku.github.io/Mayu/takadanobaba.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline pl-2"
                    >
                        <FaGlobe /> Website
                    </a>
                    <img src="/assets/takadanobaba.png" alt="Takadanobaba Fighters" className="w-full mt-2 rounded-xl" />
                    <p className="mt-2">A game for a group project at HAL. Designed to showcase the neighborhood of Takadanobaba in Shinjuku.</p>
                    <p className="mt-2">Built using Pixi.js as it's rendering engine, 高田馬場ファイターズ runs completely in browser-based JavaScript. Assets are loaded from file, and Pixi.js places the objects on an HTML5 canvas. Other game devices, such as HUD and pop-ups, are rendered in HTML and JavaScript.</p>
                    <p className="mt-2">The project was built within 3 weeks, with a further 2 weeks utilized for refinement.</p>
                    <div className=" rounded-xl border-neutral-700 p-2 mt-2">
                        <h2 className="text-sm font-bold"></h2>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant='project_tag'>#pixijs</Badge>
                            <Badge variant='project_tag'>#html5</Badge>
                            <Badge variant='project_tag'>#css</Badge>
                            <Badge variant='project_tag'>#js</Badge>
                            <Badge variant='project_tag'>#tailwind</Badge>
                        </div>
                    </div>
                </>
            case "project5":
                return <>
                    <h1 className="text-lg font-bold">ポートフォリオサイト</h1>
                    <a
                        href="https://github.com/itkla/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                    >
                        <FaGithub /> Repository
                    </a>
                    <a
                        href="https://klae.ooo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline pl-2"
                    >
                        <FaGlobe /> Website
                    </a>
                    <img src="/assets/portfolio.png" alt="Takadanobaba Fighters" className="w-full mt-2 rounded-xl" />
                    <p className="mt-2">My own personal portfolio, built in Nextjs using components utilizing GSAP, Three.js, and framer-motion.</p>
                    <p className="mt-2">Truth be told, I've been putting off making a portfolio site because I've been so busy with other things that I deemed it unnecessary. BUT, now it's an assignment, and by jove am I proud of it.</p>
                    <p className="mt-2">The design is very much inspired by the macOS desktop, where windows designed in spirit of the macOS windows (e.g. traffic light buttons) show information and details. Of course, the dock at the bottom is reminiscent of the macOS dock.</p>
                    <p className="mt-2">There are some secrets hidden within this portfolio. Can you find them all?</p>
                    <div className=" rounded-xl border-neutral-700 p-2 mt-2">
                        <h2 className="text-sm font-bold"></h2>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant='project_tag'>#nextjs</Badge>
                            <Badge variant='project_tag'>#tailwind</Badge>
                            <Badge variant='project_tag'>#gsap</Badge>
                            <Badge variant='project_tag'>#framer-motion</Badge>
                            <Badge variant='project_tag'>#threejs</Badge>
                            <Badge variant='project_tag'>#typescript</Badge>
                            <Badge variant='project_tag'>#react</Badge>
                        </div>
                    </div>
                </>;
            default:
                return <div>Placeholder content for {id}</div>;
        }
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <ClickSpark
                sparkColor="#fff"
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
            />
            <div style={{ position: "absolute", left: 20, top: 20 }}>
                <DesktopIcon
                    label="Works"
                    iconSrc={<FaFolder className="w-8 h-8" />}
                    onDoubleClick={() => openWindow("works")}
                />
            </div>
            <div style={{ position: "absolute", left: 23, top: 100 }}>
                <DesktopIcon
                    label="???"
                    iconSrc={<FaLock className="w-8 h-8" />}
                    onDoubleClick={() => openWindow("encryptedFile")}
                />
            </div>
            {windows.map(win => {
                if (!win.isOpen) return null;
                const defaultWidth = win.defaultWidth ?? 400;
                const defaultHeight = win.defaultHeight ?? 300;
                const defaultX = win.defaultX ?? 220;
                const defaultY = win.defaultY ?? 120;

                return (
                    <MacWindow
                        key={win.id}
                        defaultWidth={defaultWidth}
                        defaultHeight={defaultHeight}
                        defaultX={defaultX}
                        defaultY={defaultY}
                        windowTitle={win.title}
                        zIndex={win.zIndex}
                        onFocus={() => bringToFront(win.id)}
                        onClose={() => closeWindow(win.id)}
                    >
                        {renderWindowContent(win.id)}
                    </MacWindow>
                );
            })}
            <Footer
                onOpenProfile={() => openWindow("profile")}
                onOpenAbout={() => openWindow("about")}
                onOpenTerminal={() => openWindow("terminal")}
            />
        </div>
    );
}
