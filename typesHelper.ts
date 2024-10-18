import { Database } from "@/database.types";

export type ExistingTables = keyof Database["public"]["Tables"];

export type EntityBase<T extends ExistingTables> =
	Database["public"]["Tables"][T];

export type RowType<T extends ExistingTables> = EntityBase<T>["Row"];
export type InsertType<T extends ExistingTables> = EntityBase<T>["Insert"];
export type UpdateType<T extends ExistingTables> = EntityBase<T>["Update"];

export type Cuisines = RowType<"cuisines">;
export type Event = RowType<"events">;
