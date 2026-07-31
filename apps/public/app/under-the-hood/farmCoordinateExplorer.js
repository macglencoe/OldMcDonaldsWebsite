"use client";

import { useState } from "react";
import features from "@/public/data/map-features.json";
import styles from "./page.module.css";

const WIDTH = 620;
const HEIGHT = 470;
const PADDING = 22;

const mapFeatures = [
    { key: "parking", label: "Parking", kind: "area", group: "area" },
    { key: "meadow", label: "Meadow", kind: "area", group: "area" },
    { key: "natureMazeBounds", label: "Nature Maze", kind: "area", group: "area" },
    { key: "cornMaze", label: "Corn Maze", kind: "area", group: "crop" },
    { key: "cornMaze2", label: "Corn Maze 2", kind: "area", group: "crop" },
    { key: "pumpkinPatch1", label: "Pumpkin Patch 1", kind: "area", group: "crop" },
    { key: "pumpkinPatch2", label: "Pumpkin Patch 2", kind: "area", group: "crop" },
    { key: "sunflowers", label: "Sunflowers", kind: "area", group: "crop" },
    { key: "zinnias", label: "Zinnias", kind: "area", group: "crop" },
    { key: "pavilion", label: "Market", kind: "area", group: "building" },
    { key: "middleCreek", label: "Middle Creek", kind: "line", group: "water" },
    { key: "stream", label: "Stream", kind: "line", group: "water" },
    { key: "mainLane", label: "Main Lane", kind: "line", group: "path" },
    { key: "sideLane", label: "Side Lane", kind: "line", group: "path" },
    { key: "forestLane", label: "Forest Lane", kind: "line", group: "path" },
    { key: "hillLane", label: "Hill Lane", kind: "line", group: "path" },
    { key: "newgroundsPath", label: "New Grounds Path", kind: "line", group: "path" },
];

const allCoordinates = mapFeatures.flatMap(({ key }) => features[key] ?? []);
const latitudes = allCoordinates.map(([latitude]) => latitude);
const longitudes = allCoordinates.map(([, longitude]) => longitude);
const bounds = {
    minLat: Math.min(...latitudes),
    maxLat: Math.max(...latitudes),
    minLng: Math.min(...longitudes),
    maxLng: Math.max(...longitudes),
};

function project([latitude, longitude]) {
    const x = PADDING + ((longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (WIDTH - PADDING * 2);
    const y = PADDING + ((bounds.maxLat - latitude) / (bounds.maxLat - bounds.minLat)) * (HEIGHT - PADDING * 2);
    return [x, y];
}

function pointsFor(key) {
    return (features[key] ?? [])
        .map((coordinate) => project(coordinate).map((value) => value.toFixed(1)).join(","))
        .join(" ");
}

export default function FarmCoordinateExplorer() {
    const [selectedKey, setSelectedKey] = useState("cornMaze");
    const selected = mapFeatures.find(({ key }) => key === selectedKey);
    const selectedCoordinates = features[selectedKey] ?? [];

    return (
        <div className={styles.explorer}>
            <div className={styles.explorerBar}>
                <span>map-features.json</span>
                <span>{mapFeatures.length} mapped features</span>
            </div>

            <div className={styles.explorerBody}>
                <div className={styles.explorerCanvas}>
                    <svg
                        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                        role="img"
                        aria-label="Interactive diagram drawn from the farm map’s actual coordinates"
                    >
                        <defs>
                            <pattern id="coordinate-grid" width="31" height="31" patternUnits="userSpaceOnUse">
                                <path d="M31 0H0V31" className={styles.gridLine} />
                            </pattern>
                        </defs>
                        <rect width={WIDTH} height={HEIGHT} fill="url(#coordinate-grid)" />

                        {mapFeatures.map((feature) => {
                            const isSelected = feature.key === selectedKey;
                            const commonProps = {
                                className: `${styles.realFeature} ${styles[feature.group]} ${isSelected ? styles.selectedFeature : ""}`,
                                onClick: () => setSelectedKey(feature.key),
                                onFocus: () => setSelectedKey(feature.key),
                                tabIndex: 0,
                                role: "button",
                                "aria-label": `Show coordinates for ${feature.label}`,
                            };

                            return feature.kind === "area" ? (
                                <polygon key={feature.key} points={pointsFor(feature.key)} {...commonProps} />
                            ) : (
                                <polyline key={feature.key} points={pointsFor(feature.key)} {...commonProps} />
                            );
                        })}

                        {selectedCoordinates.map((coordinate, index) => {
                            const [cx, cy] = project(coordinate);
                            return <circle key={`${coordinate.join("-")}-${index}`} className={styles.realVertex} cx={cx} cy={cy} r="4.5" />;
                        })}
                    </svg>
                    <p className={styles.canvasHint}>Select a shape or line</p>
                </div>

                <aside className={styles.featurePanel} aria-live="polite">
                    <p>Selected feature</p>
                    <h3>{selected.label}</h3>
                    <span>{selectedCoordinates.length} coordinate points · {selected.kind === "area" ? "polygon" : "polyline"}</span>
                    <ol>
                        {selectedCoordinates.slice(0, 5).map(([latitude, longitude], index) => (
                            <li key={`${latitude}-${longitude}`}>
                                <b>{String(index + 1).padStart(2, "0")}</b>
                                <code>{latitude.toFixed(6)}, {longitude.toFixed(6)}</code>
                            </li>
                        ))}
                    </ol>
                    {selectedCoordinates.length > 5 && <small>+ {selectedCoordinates.length - 5} more points</small>}
                </aside>
            </div>

            <div className={styles.featurePicker} aria-label="Choose a map feature">
                {mapFeatures.map((feature) => (
                    <button
                        type="button"
                        key={feature.key}
                        className={feature.key === selectedKey ? styles.activeFeatureButton : ""}
                        onClick={() => setSelectedKey(feature.key)}
                    >
                        {feature.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
