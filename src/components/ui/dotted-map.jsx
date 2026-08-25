import * as React from "react";
import { createMap } from "svg-dotted-map";
import { cn } from "../../lib/utils";

// ClickHouse-style dotted world map. Dots form the continents; markers pin locations.
export function DottedMap({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  dotColor = "currentColor",
  markerColor = "var(--primary)",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}) {
  const { points, addMarkers } = createMap({ width, height, mapSamples });
  const processedMarkers = addMarkers(markers);

  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = new Map();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;
    for (const p of sorted) {
      if (p.y !== prevY) {
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }
    return { xStep: step || 1, yToRowIndex: rowMap };
  }, [points]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-white/[0.14]", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      {points.map((point, index) => {
        const rowIndex = yToRowIndex.get(point.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return <circle cx={point.x + offsetX} cy={point.y} r={dotRadius} fill={dotColor} key={`${point.x}-${point.y}-${index}`} />;
      })}

      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        const x = marker.x + offsetX;
        const y = marker.y;
        const r = marker.size ?? dotRadius;
        const shouldPulse = pulse ? marker.pulse !== false : marker.pulse === true;
        const pulseTo = r * 2.8;
        return (
          <g key={`${marker.x}-${marker.y}-${index}`}>
            <circle cx={x} cy={y} r={r} fill={markerColor} />
            {shouldPulse && (
              <g pointerEvents="none">
                <circle cx={x} cy={y} r={r} fill="none" stroke={markerColor} strokeWidth={0.35}>
                  <animate attributeName="r" values={`${r};${pulseTo}`} dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {renderMarkerOverlay?.({ marker: { ...marker, x, y }, index, x, y, r })}
          </g>
        );
      })}
    </svg>
  );
}
