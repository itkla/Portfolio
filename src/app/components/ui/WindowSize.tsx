"use client";

import { useEffect, useState } from "react";

export default function WindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        function updateSize() {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        }
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        {
            innerWidth: size.width,
            innerHeight: size.height,
        }
    );
}