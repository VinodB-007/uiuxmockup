import { integer, pgTable, varchar, date, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  age: integer().notNull(),
  email: varchar().notNull().unique(),
  creadits: integer().default(5),
});

export const ProjectTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  projectId: varchar().notNull(),

  userInput: varchar(),

  device: varchar(),

  createdOn: date().defaultNow(),

  config: json(),

  userId: varchar()
    .references(() => usersTable.email)
    .notNull(),
});