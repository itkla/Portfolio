"use client";

import React from "react";

export function HawaiiLicenseCard() {
    return (
        <div className="my-4">
            {/* <TiltedWrapper
                rotateAmplitude={5}    // Subtle tilt
                scaleOnHover={1.02}    // Slight scale on hover
                style={{
                    display: "inline-block",
                    // so it flows in document and doesn't absolutely position
                }}
            > */}
                <div
                    className="relative w-full h-auto rounded-2xl overflow-hidden text-white flex bg-black/20 shadow-lg py-4 px-2"
                    id="card-contents"
                >
                    {/* Left: Photo area */}
                    <div className="flex-shrink-0 w-[110px] h-full flex items-center justify-center bg-black/30 p-1">
                        <img
                            src="/assets/profile.jpg"
                            alt="Profile"
                            className="object-cover block mx-auto h-2/3 w-auto"
                        />
                    </div>

                    {/* Right: Info area */}
                    <div className="flex-1 p-3 relative bg-black/20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold text-white/20 pointer-events-none">
                            HAWAII
                        </div>

                        <h1 className="relative text-base font-bold z-10">HUNTER NAKAGAWA</h1>
                        <p className="relative text-xs z-10">DOB: 1998</p>
                        <p className="relative text-xs z-10">ID: DC121KSLA5G</p>
                        <p className="relative text-[0.65rem] z-10 mt-1">
                            1234 ANYWHERE ST <br />
                            HONOLULU HI 96814
                        </p>
                        <div className="relative text-[0.65rem] z-10 mt-1">
                            <span>EXP: 01/01/2030</span> &nbsp;|&nbsp; <span>SEX: M</span>
                        </div>
                    </div>
                </div>
            {/* </TiltedWrapper> */}
        </div>
    );
}
