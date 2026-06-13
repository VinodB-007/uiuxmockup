
import { id } from "date-fns/locale";
import { integer, pgTable, varchar, date, json, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  age: integer().notNull(),
  email: varchar().notNull().unique(),
  creadits: integer().default(5),
});

export const ProjectTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  projectId: varchar().notNull().unique(),

  projectName: varchar(),
  theme: varchar(),
  userInput: varchar(),
  device: varchar(),
  createdOn: date().defaultNow(),
  config: json(),
  projctVisualDecription: text(),

  userId: varchar()
    .references(() => usersTable.email)
    .notNull(),
});

export const ScreenConfigTable=pgTable('screenConfig',{
  id:integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId:varchar().references(()=>ProjectTable.projectId),
  screenId:varchar(),
  screenName:varchar(),
  purpose:varchar(),
  screenDescription:varchar(),
  code:text(),

})