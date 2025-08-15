import {
  pgTable,
  varchar,
  serial,
  integer,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Database entities (not domain models)
export const userEntities = pgTable('users', {
  id: serial('id').primaryKey(),
  auth0Id: varchar('auth0_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectEntities = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#3B82F6'),
  userId: integer('user_id')
    .notNull()
    .references(() => userEntities.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taskEntities = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('todo'),
  priority: varchar('priority', { length: 50 }).notNull().default('medium'),
  dueDate: timestamp('due_date'),
  projectId: integer('project_id')
    .notNull()
    .references(() => projectEntities.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => userEntities.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const userRelations = relations(userEntities, ({ many }) => ({
  projects: many(projectEntities),
  tasks: many(taskEntities),
}));

export const projectRelations = relations(projectEntities, ({ one, many }) => ({
  user: one(userEntities, {
    fields: [projectEntities.userId],
    references: [userEntities.id],
  }),
  tasks: many(taskEntities),
}));

export const taskRelations = relations(taskEntities, ({ one }) => ({
  user: one(userEntities, {
    fields: [taskEntities.userId],
    references: [userEntities.id],
  }),
  project: one(projectEntities, {
    fields: [taskEntities.projectId],
    references: [projectEntities.id],
  }),
}));

// Types for database entities
export type UserEntity = typeof userEntities.$inferSelect;
export type NewUserEntity = typeof userEntities.$inferInsert;

export type ProjectEntity = typeof projectEntities.$inferSelect;
export type NewProjectEntity = typeof projectEntities.$inferInsert;

export type TaskEntity = typeof taskEntities.$inferSelect;
export type NewTaskEntity = typeof taskEntities.$inferInsert;
