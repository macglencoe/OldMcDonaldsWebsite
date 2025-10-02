import { pgTable, serial, text, timestamp, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const hayrideSlots = pgTable("hayride_slots", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  start: text("start").notNull(), // ISO timestamp
  label: text("label"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  dateStartIdx: uniqueIndex("hayride_slots_date_start_idx").on(table.date, table.start),
}));

export const hayrideWagons = pgTable("hayride_wagons", {
  id: serial("id").primaryKey(),
  slotId: integer("slot_id").references(() => hayrideSlots.id),
  wagonId: text("wagon_id").notNull(),     // e.g., wagon-green
  color: text("color"),
  capacity: integer("capacity").notNull(),
  filled: integer("filled").notNull().default(0),
  version: integer("version").notNull().default(1),
  notes: text("notes"),
}, (table) => ({
  wagonSlotUnique: uniqueIndex("hayride_wagons_slot_wagon_idx").on(table.slotId, table.wagonId),
}));
