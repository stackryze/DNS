import React from 'react';


const WorldMap = () => {
    // Percentages relative to the map image
    // Calibrated based on user feedback (Germany adjusted, Hyderabad confirmed)
    const pins = [
        { name: "ns1.stackryze.com (Germany)", top: "39.5%", left: "49%" },
        { name: "ns2.stackryze.com (Hyderabad, India)", top: "57%", left: "66%" }
    ];

    return (
        <div className="relative w-full max-w-7xl mx-auto mt-8 flex flex-col">

            {/* Map Container with Glow */}
            <div className="relative w-full flex flex-col items-center">

                {/* Ambient Background Glow - Subtle Blue */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#38BDF8]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

                <img
                    src="/world_map.png"
                    alt="Global Infrastructure"
                    className="w-full h-auto opacity-90 drop-shadow-2xl grayscale-[20%] contrast-125"
                />

                {/* Pins Overlay */}
                {pins.map((pin, i) => (
                    <div
                        key={i}
                        className="absolute group z-10"
                        style={{ top: pin.top, left: pin.left }}
                    >
                        {/* 1. THE PIN (Anchored exactly at 0,0 relative to parent top/left) */}
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            {/* Pulse Ring */}
                            <div className="absolute w-[20px] h-[20px] bg-[#38BDF8] rounded-full animate-ping opacity-20"></div>
                            {/* Center Dot */}
                            <div className="relative w-2.5 h-2.5 bg-[#38BDF8] rounded-full shadow-[0_0_10px_rgba(56,189,248,1)] ring-2 ring-black/20"></div>
                        </div>

                        {/* 2. THE LABEL (Hanging BELOW the pin) */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">

                            {/* Connector Line (Vertical) */}
                            <div className="h-6 w-px bg-gradient-to-b from-[#38BDF8]/50 to-transparent mb-1"></div>

                            {/* Glassmorphic Tooltip */}
                            <div className="bg-[#0f1012]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:bg-[#0f1012]/90 hover:border-[#38BDF8]/30 group-hover:z-20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></span>
                                <span className="text-white/90 text-[10px] sm:text-xs font-medium tracking-wide whitespace-nowrap font-mono">
                                    {pin.name}
                                </span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* Simplified Legend - Floating Pill (Centered) */}
            <div className="mt-8 mb-8 flex justify-center w-full">
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shadow-lg">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Server Location</span>
                </div>
            </div>

        </div>
    );
};

export default WorldMap;
