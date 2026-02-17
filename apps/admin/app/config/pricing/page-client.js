"use client";

import ConfigActionsBar from "@/components/config/actionsBar";
import ConfigSplitListEditor from "@/components/config/splitListEditor";
import { useEffect, useMemo, useRef, useState } from "react";

const PRICING_KEYS = [
    { key: "admission", label: "Admission" },
    { key: "hayride", label: "Hayride" },
    { key: "pumpkin-patch", label: "Pumpkin patch" },
    { key: "flower-cup", label: "Flower cup" },
    { key: "sunflower", label: "Sunflower stem" },
    { key: "gazebo-rental", label: "Gazebo rental" },
];

const EMPTY_ENTRY = { amount: null, per: "", notes: [] };

function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj ?? {}));
}

function normalizePricingState(pricing) {
    const source = cloneObject(pricing);
    return PRICING_KEYS.reduce((acc, { key }) => {
        const entry = source[key] ?? {};
        const parsedAmount = typeof entry.amount === "string" ? Number(entry.amount) : entry.amount;
        acc[key] = {
            amount: Number.isFinite(parsedAmount) ? parsedAmount : null,
            per: typeof entry.per === "string" ? entry.per : "",
            notes: Array.isArray(entry.notes) ? entry.notes : [],
        };
        return acc;
    }, {});
}

function getLabelForKey(key) {
    return PRICING_KEYS.find((entry) => entry.key === key)?.label ?? key;
}

function formatAmountPreview(amount) {
    if (!Number.isFinite(amount)) return "Unset";
    if (amount === 0) return "$0.00";
    if (amount < 1) return `${Math.round(amount * 100)}¢`;
    return `$${amount.toFixed(2)}`;
}

function sanitizeEntry(entry) {
    const next = entry ?? {};
    const amount = typeof next.amount === "string" ? Number(next.amount) : next.amount;
    const per = typeof next.per === "string" ? next.per.trim() : next.per;
    const notes = Array.isArray(next.notes) ? next.notes.map((note) => note.trim()).filter(Boolean) : [];

    return {
        amount,
        ...(per ? { per } : {}),
        ...(notes.length ? { notes } : {}),
    };
}

export default function PricingPageClient({ pricing }) {
    const initialPricing = useMemo(() => normalizePricingState(pricing), [pricing]);
    const originalObjectRef = useRef(initialPricing);
    const [pricingState, setPricingState] = useState(() => initialPricing);
    const [selectedKey, setSelectedKey] = useState(() => {
        const keys = Object.keys(pricing ?? {});
        const ordered = PRICING_KEYS.map((entry) => entry.key);
        return ordered.find((key) => keys.includes(key)) ?? ordered[0] ?? null;
    });
    const [saveState, setSaveState] = useState({ status: "idle", message: "" });

    const orderedKeys = useMemo(() => PRICING_KEYS.map((entry) => entry.key), []);

    useEffect(() => {
        if (selectedKey === null && orderedKeys.length > 0) {
            setSelectedKey(orderedKeys[0]);
        } else if (selectedKey && !orderedKeys.includes(selectedKey) && orderedKeys.length > 0) {
            setSelectedKey(orderedKeys[0]);
        }
    }, [orderedKeys, selectedKey]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(pricingState) !== JSON.stringify(originalObjectRef.current);
    }, [pricingState]);

    const validationErrors = useMemo(() => {
        const errors = [];
        orderedKeys.forEach((key) => {
            const entry = pricingState?.[key];
            const amount = typeof entry?.amount === "string" ? Number(entry.amount) : entry?.amount;
            const per = entry?.per?.trim();
            if (!Number.isFinite(amount) || amount < 0) {
                errors.push(`${getLabelForKey(key)} needs a valid non-negative amount.`);
            }
            if (!per) {
                errors.push(`${getLabelForKey(key)} needs a unit (per).`);
            }
            if (entry?.notes && !Array.isArray(entry.notes)) {
                errors.push(`${getLabelForKey(key)} notes must be a list.`);
            }
        });
        return errors;
    }, [orderedKeys, pricingState]);

    const handleEntryChange = (key, updater) => {
        setPricingState((current) => {
            const existing = current?.[key] ?? EMPTY_ENTRY;
            const nextEntry = updater(existing);
            return { ...(current ?? {}), [key]: { ...EMPTY_ENTRY, ...nextEntry } };
        });
    };

    const handleResetAll = () => {
        const cloned = cloneObject(originalObjectRef.current);
        setPricingState(cloned);
        const keys = Object.keys(cloned);
        const ordered = PRICING_KEYS.map((entry) => entry.key);
        setSelectedKey(ordered.find((key) => keys.includes(key)) ?? keys[0] ?? ordered[0] ?? null);
    };

    const handleSave = async () => {
        setSaveState({ status: "saving", message: "" });
        try {
            const payload = orderedKeys.reduce((acc, key) => {
                const sanitized = sanitizeEntry(pricingState?.[key]);
                if (!Number.isFinite(sanitized.amount)) {
                    throw new Error(`${getLabelForKey(key)} amount must be a number before saving.`);
                }
                if (!sanitized.per) {
                    throw new Error(`${getLabelForKey(key)} unit (per) is required before saving.`);
                }
                acc[key] = sanitized;
                return acc;
            }, {});

            const response = await fetch("/api/config?key=pricing", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || `Save failed with status ${response.status}`);
            }

            const data = await response.json();
            const nextValue = normalizePricingState(data.value ?? payload);
            originalObjectRef.current = nextValue;
            setPricingState(nextValue);
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
                title="Pricing"
                description="Edit pricing entries. Keys are fixed; update amount, unit, and notes."
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
                title="Pricing entries"
                items={orderedKeys}
                selectedIndex={orderedKeys.findIndex((key) => key === selectedKey)}
                onSelect={(index) => setSelectedKey(orderedKeys[index] ?? null)}
                getKey={(key) => key}
                renderEmpty={<p className="px-4 py-6 text-center text-sm text-gray-500">No pricing entries found.</p>}
                renderRow={({ item: key, selected, onSelect }) => {
                    const entry = pricingState?.[key] ?? EMPTY_ENTRY;
                    return (
                        <button
                            type="button"
                            onClick={onSelect}
                            className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition ${selected ? "bg-accent/10" : "hover:bg-gray-50"}`}
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-900">{getLabelForKey(key)}</p>
                                <p className="text-xs text-gray-500">
                                    {formatAmountPreview(typeof entry.amount === "string" ? Number(entry.amount) : entry.amount)}
                                    {entry.per ? ` / ${entry.per}` : ""}
                                </p>
                            </div>
                            {Array.isArray(entry.notes) && entry.notes.length > 0 && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                                    {entry.notes.length} note{entry.notes.length === 1 ? "" : "s"}
                                </span>
                            )}
                        </button>
                    );
                }}
                rightContent={
                    selectedKey === null ? (
                        <p className="text-sm text-gray-500">Select a pricing entry to edit.</p>
                    ) : (
                        <PricingEntryEditor
                            key={selectedKey}
                            entry={pricingState?.[selectedKey] ?? EMPTY_ENTRY}
                            label={getLabelForKey(selectedKey)}
                            onChange={(next) => handleEntryChange(selectedKey, () => next)}
                        />
                    )
                }
            />
        </div>
    );
}

function PricingEntryEditor({ entry, onChange, label }) {
    const [notesDraft, setNotesDraft] = useState(() => (Array.isArray(entry.notes) ? entry.notes.join("\n") : ""));

    useEffect(() => {
        setNotesDraft(Array.isArray(entry.notes) ? entry.notes.join("\n") : "");
    }, [entry.notes]);

    const handleFieldChange = (field, value) => {
        onChange({ ...entry, [field]: value });
    };

    const handleNotesChange = (value) => {
        setNotesDraft(value);
        const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
        onChange({ ...entry, notes: lines });
    };

    const amountValue = entry.amount === null || entry.amount === undefined ? "" : entry.amount;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">Edit the price, unit, and optional notes for this entry.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Amount (required)</label>
                    <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={amountValue}
                        onChange={(event) => {
                            const raw = event.target.value;
                            const numeric = raw === "" ? null : Number(raw);
                            handleFieldChange("amount", Number.isFinite(numeric) ? numeric : null);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Per (required)</label>
                    <input
                        type="text"
                        value={entry.per ?? ""}
                        onChange={(event) => handleFieldChange("per", event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                        placeholder="person, pound, stem..."
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Notes (optional, one per line)</label>
                <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={(event) => handleNotesChange(event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-accent focus:outline-none"
                    placeholder="Paid at the admission booth"
                />
            </div>
        </div>
    );
}
