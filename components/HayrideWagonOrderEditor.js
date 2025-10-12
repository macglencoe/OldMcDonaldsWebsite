"use client";

import { useEffect, useMemo, useState } from "react";
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CaretDown, DotsSixVertical } from "phosphor-react";

const BG_COLOR_CLASSES = {
    amber: "bg-amber-600",
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    green: "bg-green-600",
    indigo: "bg-indigo-600",
    lime: "bg-lime-600",
    orange: "bg-orange-600",
    pink: "bg-pink-600",
    purple: "bg-purple-600",
    red: "bg-red-600",
    rose: "bg-rose-600",
    sky: "bg-sky-600",
    teal: "bg-teal-600",
    violet: "bg-violet-600",
    yellow: "bg-yellow-600",
};

function DragHandleButton({ listeners, label, disabled }) {
    return (
        <button
            type="button"
            {...(listeners ?? {})}
            disabled={disabled}
            aria-label={label}
            className={`flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-background transition focus-visible:outline-none focus-visible:ring-2 hover:text-slate-500 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
            <DotsSixVertical size={20} weight="bold" />
        </button>
    );
}

function WagonDetails({ wagon }) {
    return (
        <div className="flex flex-1 flex-col gap-1 text-left text-white">
            <div className="flex items-center justify-between gap-3">
                <span className="font-bold">{wagon?.label ?? "Unnamed wagon"}</span>
            </div>
            {wagon?.notes ? (
                <div className="text-xs text-slate-500">{wagon.notes}</div>
            ) : null}
        </div>
    );
}

function SortableWagon({ wagon, disabled = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: wagon?.id ?? "unknown", disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const dragLabel = wagon?.name ? `Reorder ${wagon.name}` : "Reorder wagon";

    const normalizedColor = String(wagon.color).toLowerCase();
    const bgColor = BG_COLOR_CLASSES[normalizedColor] ?? "bg-foreground";

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`flex items-center gap-3 rounded-xl border border-slate-200 shadow-sm ring-1 ring-transparent transition
        ${isDragging ? "shadow-md ring-indigo-200" : ""}
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${bgColor}`}
        >
            <DragHandleButton
                listeners={disabled ? undefined : listeners}
                label={dragLabel}
                disabled={disabled}
            />
            <WagonDetails wagon={wagon} />
        </li>
    );
}

function sanitizeItems(input) {
    if (!Array.isArray(input)) {
        return [];
    }
    return input.map((item, index) => {
        if (item && item.id) {
            return item;
        }
        const normalized = item ? { ...item } : {};
        return {
            ...normalized,
            id: normalized.id ?? `wagon-${index}`,
        };
    });
}

export default function HayrideWagonOrderEditor({
    wagons = [],
    onOrderChange,
    className = "",
    title = "Wagon order",
    description = "Drag and drop to set the default wagon order for every time slot.",
    emptyStateMessage = "No wagons found.",
    getDragDisabled,
}) {
    const [items, setItems] = useState(() => sanitizeItems(wagons));

    useEffect(() => {
        setItems(sanitizeItems(wagons));
    }, [wagons]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const itemIds = useMemo(() => items.map((wagon) => wagon.id), [items]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((wagon) => wagon.id === active.id);
        const newIndex = items.findIndex((wagon) => wagon.id === over.id);

        if (oldIndex < 0 || newIndex < 0) {
            return;
        }

        const nextItems = arrayMove(items, oldIndex, newIndex);
        setItems(nextItems);
        onOrderChange?.(nextItems);
    };

    return (
        <details className={`flex flex-col w-full items-stretch p-3 border border-accent/20 rounded-2xl gap-4 ${className}`}>
            <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 [&::-webkit-details-marker]:hidden">
                <div className="flex flex-col text-left">
                    <span className="text-base font-semibold text-slate-800">{title}</span>
                        <span className="text-xs font-medium text-slate-500">{description}</span>
                </div>
                <CaretDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" weight="bold" />
            </summary>

            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                    {emptyStateMessage}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                        <ol className="flex list-none flex-col gap-3 p-0">
                            {items.map((wagon) => {
                                const disabled = typeof getDragDisabled === "function" ? Boolean(getDragDisabled(wagon)) : false;
                                return (
                                    <SortableWagon key={wagon.id} wagon={wagon} disabled={disabled} />
                                );
                            })}
                        </ol>
                    </SortableContext>
                </DndContext>
            )}
        </details>
    );
}
