"use client";

import ConfigActionsBar from "@/components/config/actionsBar";
import ConfigSplitListEditor from "@/components/config/splitListEditor";
import { useEffect, useMemo, useRef, useState } from "react";

const DAY_KEYS = [
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
];

const EMPTY_DAY = { open: "", close: "" };

function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj ?? {}));
}

function normalizeWeeklyHours(hours) {
    const source = cloneObject(hours);
    return DAY_KEYS.reduce((acc, { key }) => {
        const entry = source[key] ?? {};
        acc[key] = {
            open: typeof entry.open === "string" ? entry.open : "",
            close: typeof entry.close === "string" ? entry.close : "",
        };
        return acc;
    }, {});
}

function isValidTimeString(value) {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    // Require HH:MM:SS in 24-hour format
    return /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(trimmed);
}

function toSecondsPrecision(value) {
    if (!isValidTimeString(value)) return "";
    const [hour, minute, second = "00"] = value.trim().split(":");
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    const ss = String(second).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

export default function WeeklyHoursPageClient({ weeklyHours }) {
    const initial = useMemo(() => normalizeWeeklyHours(weeklyHours), [weeklyHours]);
    const originalObjectRef = useRef(initial);
    const [hoursState, setHoursState] = useState(() => initial);
    const [selectedKey, setSelectedKey] = useState(() => DAY_KEYS[0]?.key ?? null);
    const [saveState, setSaveState] = useState({ status: "idle", message: "" });

    const orderedKeys = useMemo(() => DAY_KEYS.map((day) => day.key), []);

    useEffect(() => {
        if (selectedKey && orderedKeys.includes(selectedKey)) return;
        if (!selectedKey && orderedKeys.length > 0) {
            setSelectedKey(orderedKeys[0]);
        }
    }, [orderedKeys, selectedKey]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(hoursState) !== JSON.stringify(originalObjectRef.current);
    }, [hoursState]);

    const validationErrors = useMemo(() => {
        const errors = [];
        for (const { key, label } of DAY_KEYS) {
            const entry = hoursState?.[key] ?? {};
            if (!isValidTimeString(entry.open)) {
                errors.push(`${label} open time must be HH:MM:SS (24h).`);
            }
            if (!isValidTimeString(entry.close)) {
                errors.push(`${label} close time must be HH:MM:SS (24h).`);
            }
        }
        return errors;
    }, [hoursState]);

    const handleDayChange = (key, updater) => {
        setHoursState((current) => {
            const nextEntry = updater(current?.[key] ?? EMPTY_DAY);
            return { ...(current ?? {}), [key]: { ...EMPTY_DAY, ...nextEntry } };
        });
    };

    const handleResetAll = () => {
        const cloned = cloneObject(originalObjectRef.current);
        setHoursState(cloned);
        setSelectedKey(DAY_KEYS[0]?.key ?? null);
    };

    const handleSave = async () => {
        setSaveState({ status: "saving", message: "" });
        try {
            const payload = orderedKeys.reduce((acc, key) => {
                const entry = hoursState?.[key] ?? EMPTY_DAY;
                if (!isValidTimeString(entry.open) || !isValidTimeString(entry.close)) {
                    throw new Error("All days need valid open and close times before saving.");
                }
                acc[key] = {
                    open: toSecondsPrecision(entry.open),
                    close: toSecondsPrecision(entry.close),
                };
                return acc;
            }, {});

            const response = await fetch("/api/config?key=weekly-hours", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const detail = Array.isArray(data.details) && data.details.length > 0
                    ? data.details[0]?.message
                    : null;
                throw new Error(detail || data.error || `Save failed with status ${response.status}`);
            }

            const data = await response.json();
            const nextValue = normalizeWeeklyHours(data.value ?? payload);
            originalObjectRef.current = nextValue;
            setHoursState(nextValue);
            setSaveState({ status: "success", message: "Saved" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save";
            setSaveState({ status: "error", message });
        } finally {
            setTimeout(() => setSaveState({ status: "idle", message: "" }), 2000);
        }
    };

    return (
        <div className="space-y-5 p-3">
            <ConfigActionsBar
                title="Weekly Hours"
                description="Edit open and close times for each day. Format: 24h HH:MM."
                buttons={[
                    {
                        label: saveState.status === "saving" ? "Saving..." : "Save changes",
                        onClick: handleSave,
                        disabled: validationErrors.length > 0 || !hasChanges || saveState.status === "saving",
                    },
                    {
                        label: "Revert to original",
                        onClick: handleResetAll,
                        disabled: !hasChanges,
                    }
                ]}
            />

            {(saveState.status === "error" || validationErrors.length > 0 || saveState.status === "success") && (
                <div className="text-xs">
                    {validationErrors.length > 0 && (
                        <p className="text-red-600">Fix before saving: {validationErrors[0]}</p>
                    )}
                    {saveState.status === "error" && (
                        <p className="text-red-600">Save failed: {saveState.message}</p>
                    )}
                    {saveState.status === "success" && (
                        <p className="text-green-600">Saved</p>
                    )}
                </div>
            )}

            <ConfigSplitListEditor
                title="Weekly hours"
                items={orderedKeys}
                selectedIndex={orderedKeys.findIndex((key) => key === selectedKey)}
                onSelect={(index) => setSelectedKey(orderedKeys[index] ?? null)}
                getKey={(key) => key}
                renderRow={({ item: key, selected, onSelect }) => {
                    const entry = hoursState?.[key] ?? EMPTY_DAY;
                    const label = DAY_KEYS.find((day) => day.key === key)?.label ?? key;
                    return (
                        <button
                            type="button"
                            onClick={onSelect}
                            className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition ${selected ? "bg-accent/10" : "hover:bg-gray-50"}`}
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-900">{label}</p>
                                <p className="text-xs text-gray-500">
                                    {entry.open || "--:--"} to {entry.close || "--:--"}
                                </p>
                            </div>
                        </button>
                    );
                }}
                rightContent={
                    selectedKey === null ? (
                        <p className="text-sm text-gray-500">Select a day to edit.</p>
                    ) : (
                        <DayHoursEditor
                            key={selectedKey}
                            dayKey={selectedKey}
                            entry={hoursState?.[selectedKey] ?? EMPTY_DAY}
                            onChange={(next) => handleDayChange(selectedKey, () => next)}
                        />
                    )
                }
            />
        </div>
    );
}

function DayHoursEditor({ entry, onChange, dayKey }) {
    const label = DAY_KEYS.find((day) => day.key === dayKey)?.label ?? dayKey;

    const handleFieldChange = (field, value) => {
        onChange({ ...entry, [field]: value });
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">Use 24-hour format with seconds (e.g., 09:30:00, 18:00:00).</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Open (HH:MM:SS)</label>
                    <input
                        type="time"
                        step="1"
                        value={entry.open ?? ""}
                        onChange={(event) => handleFieldChange("open", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Close (HH:MM:SS)</label>
                    <input
                        type="time"
                        step="1"
                        value={entry.close ?? ""}
                        onChange={(event) => handleFieldChange("close", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
