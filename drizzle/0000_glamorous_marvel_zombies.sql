CREATE TABLE "hayride_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"start" text NOT NULL,
	"label" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hayride_wagons" (
	"id" serial PRIMARY KEY NOT NULL,
	"slot_id" integer,
	"wagon_id" text NOT NULL,
	"color" text,
	"capacity" integer NOT NULL,
	"filled" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "hayride_wagons" ADD CONSTRAINT "hayride_wagons_slot_id_hayride_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."hayride_slots"("id") ON DELETE no action ON UPDATE no action;