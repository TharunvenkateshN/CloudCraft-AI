import React from 'react';
import { cn } from "@/lib/utils";
import { STATES, INDIA_OUTLINE, VIEW_BOX } from './statesData';

interface IndiaMapProps {
    activeState: string | null;
    onSelectState: (stateName: string) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ activeState, onSelectState }) => {
    return (
        <div className="relative w-full h-[550px] flex items-center justify-center p-4">
            {/* 3D Perspective Wrapper */}
            <div
                className="relative w-full h-full transition-all duration-1000 ease-out"
            >
                <svg
                    viewBox={VIEW_BOX}
                    className="w-full h-full drop-shadow-[0_50px_50px_rgba(0,0,0,0.6)]"
                >
                    <defs>
                        <mask id="map-mask">
                            <rect x="0" y="0" width="612" height="696" fill="white" />
                            {/* Mask out Andaman & Nicobar region (bottom right) */}
                            <rect x="450" y="500" width="162" height="196" fill="black" />
                        </mask>
                    </defs>

                    {/* Main Landmass Surface - NO STROKE (compound path stroke creates ray artifacts) */}
                    <path
                        d={INDIA_OUTLINE}
                        fill="rgba(20, 30, 50, 1)"
                        mask="url(#map-mask)"
                    />

                    {/* Individual States */}
                    {STATES.filter(s => s.id !== 'AN').map((state) => (
                        <g
                            key={state.id}
                            className="group cursor-pointer"
                        >
                            {/* State Body */}
                            <path
                                d={state.path}
                                className={cn(
                                    "transition-all duration-500 ease-out outline-none",
                                    activeState === state.name
                                        ? "fill-indigo-500 filter drop-shadow-[0_0_18px_rgba(99,102,241,0.8)]"
                                        : "fill-slate-700/80 hover:fill-indigo-600/50"
                                )}
                                onClick={() => onSelectState(state.name)}
                            />

                            {/* Geographical Data Label */}
                            <text
                                x={state.centroid.x}
                                y={state.centroid.y}
                                className={cn(
                                    "text-[7px] pointer-events-none transition-all duration-500 font-bold tracking-tighter",
                                    activeState === state.name ? "fill-white opacity-100" : "fill-slate-400/60 opacity-0 group-hover:opacity-100"
                                )}
                                textAnchor="middle"
                            >
                                {state.id}
                            </text>

                            {/* Pulsing Beacon for Active Location */}
                            {activeState === state.name && (
                                <g>
                                    <circle
                                        cx={state.centroid.x}
                                        cy={state.centroid.y}
                                        r="3"
                                        className="fill-white animate-ping"
                                    />
                                    <circle
                                        cx={state.centroid.x}
                                        cy={state.centroid.y}
                                        r="1.5"
                                        className="fill-indigo-200"
                                    />
                                </g>
                            )}
                        </g>
                    ))}
                </svg>

                {/* Grid Effect Behind Map */}
                <div
                    className="absolute inset-0 pointer-events-none z-[-1] transition-opacity duration-1000"
                    style={{
                        opacity: activeState ? 0.4 : 0.7,
                        backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)'
                    }}
                />

                {/* Floating Telemetry HUD */}
                {activeState && (
                    <div
                        className="absolute top-4 left-4 p-4 bg-slate-900/60 backdrop-blur-2xl border-l-4 border-indigo-500 rounded-lg shadow-2xl animate-in fade-in slide-in-from-left-4 duration-500"
                    >
                        <p className="text-[9px] uppercase tracking-widest text-indigo-400 font-black mb-0.5">Territory Locked</p>
                        <p className="text-lg font-black text-white uppercase leading-none">{activeState}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                            </div>
                            <span className="text-[8px] font-mono text-indigo-300">SYNCED</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Geo-Coordinate Telemetry Overlay */}
            <div className="absolute top-8 right-8 flex flex-col gap-4">
                <div className="p-3 border border-white/5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-mono text-indigo-400 shadow-xl border-r-indigo-500/50">
                    <span className="opacity-50 tracking-tighter">SURVEY_UNIT:</span> CC-AI-01<br />
                    <span className="opacity-50 tracking-tighter">PRECISION:</span> GEOGRAPHIC_HD<br />
                    <span className="opacity-50 tracking-tighter">COORD_GRID:</span> 20.59°N / 78.96°E
                </div>
            </div>
        </div>
    );
};
