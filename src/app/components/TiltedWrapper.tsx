"use client";

import React, { useRef, ReactNode, CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltedWrapperProps {
    /** Absolutely position the wrapper by passing style with left, top, width, height, etc. */
    style?: CSSProperties;
    /** The content that will tilt (e.g., your MacWindow). */
    children: ReactNode;
    /** How many degrees to rotate around X/Y for full movement. */
    rotateAmplitude?: number;
    /** How much to scale up on hover (e.g. 1.05 => 105%). */
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

        // Measure the element that we're tilting
        const rect = el.getBoundingClientRect();

        // Distances from the center
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        // Convert offsets to rotation
        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
    }

    function handleMouseLeave() {
        // Reset to no tilt
        rotateX.set(0);
        rotateY.set(0);
        scale.set(1);
    }

    return (
        <div
            ref={containerRef}
            style={{
                // We want absolute positioning so you can place it anywhere
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
