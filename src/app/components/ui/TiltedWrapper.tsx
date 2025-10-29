"use client";

import React, { useRef, ReactNode, CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltedWrapperProps {
    style?: CSSProperties;
    children: ReactNode;
    rotateAmplitude?: number;
    scaleOnHover?: number;
}

export function TiltedWrapper({
    style,
    children,
    rotateAmplitude = 10,
    scaleOnHover = 1.05,
}: TiltedWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const rotateX = useSpring(useMotionValue(0), {
        damping: 30,
        stiffness: 100,
    });
    const rotateY = useSpring(useMotionValue(0), {
        damping: 30,
        stiffness: 100,
    });
    const scale = useSpring(1, {
        damping: 30,
        stiffness: 100,
    });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();

        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
        scale.set(1);
    }

    return (
        <div
            ref={containerRef}
            style={{
                // position: "",
                display: "inline-block",
                perspective: "800px",
                perspectiveOrigin: "center center",
                ...style,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    rotateX,
                    rotateY,
                    scale,
                    width: "100%",
                    height: "100%",
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
