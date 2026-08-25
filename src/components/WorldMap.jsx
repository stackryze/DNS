import React from 'react';

const PINS = [
  { name: 'ns1.stackryze.com — New York', top: '45%', left: '29%' },
  { name: 'ns2.stackryze.com — Frankfurt', top: '39%', left: '49%' },
  { name: 'ns3.stackryze.com — Hyderabad', top: '57%', left: '66%' },
];

export default function WorldMap() {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col">
      <div className="relative flex w-full flex-col items-center py-3">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <img src="/world_map.png" alt="Global anycast network" className="h-auto w-full opacity-90 contrast-125 grayscale-[20%]" />

        {PINS.map((pin, i) => (
          <div key={i} className="group absolute z-10" style={{ top: pin.top, left: pin.left }}>
            <div className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="relative h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15 transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 flex -translate-x-1/2 translate-y-1 flex-col items-center opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mb-1 h-5 w-px bg-gradient-to-b from-primary/50 to-transparent" />
              <div className="flex items-center gap-2 rounded-lg border border-border bg-popover px-3 py-1.5 shadow-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="whitespace-nowrap font-mono text-[10px] font-medium tracking-wide text-foreground/90 sm:text-xs">{pin.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
