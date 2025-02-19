"use client";

import Dock from '@/app/components/Dock/Dock';
import { useRouter } from 'next/navigation';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { ImInstagram, ImGithub } from 'react-icons/im';
import {  } from '@heroicons/react/24/solid';
import { RiUserSmileLine, RiQuestionnaireFill } from "react-icons/ri";
import {
    FaLine, 
    FaGear, 
    FaEnvelope,
    FaGithub,
    FaInstagram,
    FaUser,
    FaQuestion,
    FaTerminal,
    FaIdCard
} from "react-icons/fa6";

interface FooterProps {
    onOpenProfile?: () => void; // callback to open the MacWindow
    onOpenAbout?: () => void; // callback to open the MacWindow
    onOpenTerminal?: () => void; // callback to open the MacWindow
}

export default function Footer({ onOpenProfile, onOpenAbout, onOpenTerminal }: FooterProps) {
    const router = useRouter();

    const items = [
        { icon: <FaUser size={18} />, label: 'Home', onClick: () => { onOpenProfile?.() } },
        { icon: <FaIdCard size={18} />, label: 'About', onClick: () => { onOpenAbout?.() } },
        { icon: <FaGithub size={18} />, label: 'Github', onClick: () => { router.push('https://github.com/itkla') } },
        { icon: <FaInstagram size={18} />, label: 'Instagram', onClick: () => { router.push('https://instagram.com/hunternakagawa') } },
        { icon: <FaLine size={18} />, label: 'LINE', onClick: () => { router.push('https://line.me/ti/p/eEv6U32P63') } },
        { icon: <FaEnvelope size={18} />, label: 'Mail', onClick: () => { router.push('mailto:hunternakagawa@icloud.com') } },
        { icon: <FaTerminal size={18} />, label: 'Terminal', onClick: () => { onOpenTerminal?.() } },
    ];
    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}>

            <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
            />
        </div>
    );
}