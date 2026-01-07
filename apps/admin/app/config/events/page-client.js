"use client";

import ConfigActionsBar from "@/components/config/actionsBar";
import EventEditor from "@/components/config/eventEditor";
import PreviewDivider from "@/components/config/previewDivider";
import ConfigSplitListEditor from "@/components/config/splitListEditor";
import { FestivalCalendar } from "@public-ui/calendar";
import { useMemo, useRef, useState } from "react";

function cloneItems(items) {
    return JSON.parse(JSON.stringify(items ?? []));
}

export default function CalendarPageClient({ calendarConfig }) {
    const schedule = calendarConfig?.schedule || [];
    const initialDate = calendarConfig?.initialDate
    const originalItemsRef = useRef(cloneItems(schedule));
    const [items, setItems] = useState(() => cloneItems(schedule));
    const [selectedIndex, setSelectedIndex] = useState(() => (schedule?.length ? 0 : null));
    const [saveState, setSaveState] = useState({ status: "idle", message: "" });

    const hasChanges = useMemo(() => {
        return JSON.stringify(items) !== JSON.stringify(originalItemsRef.current)
    }, [items])

    const validationErrors = useMemo(() => {
        const errors = [];
        items.forEach((item, index) => {
            if (!item.title || item.title.trim() === "") {
                errors.push(`Event ${index + 1} is missing a title.`);
            }
            if (!item.start || item.start.trim() === "") {
                errors.push(`Event ${index + 1} is missing a start date.`);
            }
            if (!item.end || item.end.trim() === "") {
                errors.push(`Event ${index + 1} is missing an end date.`);
            }
        })
        return errors;
    }, [items]);

    const handleEventChange = (index, nextEvent) => {
        setItems((current) => current.map((item, i) => i === index ? nextEvent : item))
    }

    const handleEventDelete = (index) => {
        setItems((current) => {
            const next = current.filter((_, i) => i !== index)
            setSelectedIndex((prev) => {
                if (next.length === 0) return null
                if (prev === null) return 0
                if (prev === index) return Math.min(index, next.length - 1)
                if (prev > index) return prev - 1
                return prev
            })
            return next
        })
    }

    const handleResetAll = () => {
        setItems(cloneItems(originalItemsRef.current));
        setSelectedIndex(originalItemsRef.current.length ? 0 : null);
    }

    const handleAddEvent = () => {
        setItems((current) => [...current, { title: "", start: "", end: "" }]);
        setSelectedIndex(items.length);
    }

    const handleSave = async () => {
        // TODO
    }

    const formatDate = (iso) => {
        if (!iso) return "Not set"
        const date = new Date(iso)
        if (Number.isNaN(date.getTime())) return "Invalid date"
        return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    }



    return (
        <div className="space-y-5 p-3">
            <ConfigActionsBar
                title="Calendar Events"
                description="Manage calendar events for Old McDonald's website."
                buttons={[
                    {
                        label: saveState.status === "saving" ? "Saving..." : "Save Changes",
                        onClick: handleSave,
                        disabled: validationErrors.length > 0 || !hasChanges || saveState.status === "saving"
                    },
                    {
                        label: "Add Event",
                        onClick: handleAddEvent
                    },
                    {
                        label: "Revert to original",
                        onClick: handleResetAll,
                        disabled: !hasChanges
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
                title="Events"
                items={items}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                getKey={(_, idx) => idx}
                renderEmpty={<p className="px-4 py-6 text-center text-sm text-gray-500">No Events found.</p>}
                renderRow={({ item, index, selected, onSelect }) => (
                    <button
                        key={index}
                        type="button"
                        onClick={onSelect}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition ${selected ? "bg-gray-50" : ""
                            }`}
                    >
                        <div className="space-y-1">
                            <p className="text-gray-900 font-semibold">{item.title}</p>
                            <p className="text-xs text-gray-600">
                                {formatDate(item.start)} - {formatDate(item.end)}
                            </p>
                        </div>
                        {item.category &&
                            <div className="flex flex-col items-end gap-1 text-xs">
                                <p className="text-gray-600">Category</p>
                                <p className="text-gray-900 font-semibold">{item.category}</p>
                            </div>
                        }
                    </button>
                )}
                rightContent={
                    selectedIndex === null ? (
                        <p className="text-sm text-gray-500">Select an event to edit.</p>
                    ) : (
                        <EventEditor
                            event={items[selectedIndex]}
                            onChange={(nextEvent) => handleEventChange(selectedIndex, nextEvent)}
                            onDelete={() => handleEventDelete(selectedIndex)}
                            possibleCategories={[
                                "night-maze",
                                "event"
                            ]}
                        />
                    )
                }
            />
            
            <PreviewDivider />

            <FestivalCalendar scheduleArray={items} initialDateString={initialDate} />
        </div>
    )
}