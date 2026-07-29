"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
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
import { PiCaretDownBold, PiDotsSixVerticalBold } from "react-icons/pi";

const WAGON_STYLES = {
  blue: "border-blue-600 bg-blue-600 text-white",
  green: "border-green-600 bg-green-600 text-white",
  red: "border-red-600 bg-red-600 text-white",
  white: "border-slate-300 bg-white text-slate-800",
};

function SortableWagon({ wagon }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: wagon.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-xl border p-2 shadow-sm ${
        WAGON_STYLES[String(wagon.color).toLowerCase()] ?? "border-slate-600 bg-slate-600 text-white"
      } ${isDragging ? "z-10 scale-[1.02] shadow-lg" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab rounded-lg p-2 hover:bg-black/10 active:cursor-grabbing"
        aria-label={`Reorder ${wagon.label}`}
      >
        <PiDotsSixVerticalBold size={20} />
      </button>
      <span className="font-bold">{wagon.label}</span>
    </li>
  );
}

export default function HayrideWagonOrderEditor({ wagons, onOrderChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <details className="group rounded-2xl border border-accent/20 bg-background p-3 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-2 hover:bg-foreground/5">
        <span>
          <span className="block font-bold">Wagon order</span>
          <span className="block text-xs text-foreground/60">
            Drag to change the order shown in every time slot.
          </span>
        </span>
        <PiCaretDownBold className="transition-transform group-open:rotate-180" />
      </summary>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          const from = wagons.findIndex((wagon) => wagon.id === active.id);
          const to = wagons.findIndex((wagon) => wagon.id === over.id);
          if (from >= 0 && to >= 0) onOrderChange(arrayMove(wagons, from, to));
        }}
      >
        <SortableContext
          items={wagons.map((wagon) => wagon.id)}
          strategy={verticalListSortingStrategy}
        >
          <ol className="mt-3 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {wagons.map((wagon) => <SortableWagon key={wagon.id} wagon={wagon} />)}
          </ol>
        </SortableContext>
      </DndContext>
    </details>
  );
}
