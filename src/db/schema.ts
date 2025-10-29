import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const flowers = sqliteTable('flowers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    gridData: text('grid_data', { mode: 'json' }).notNull().$type<string[][]>(),
    name: text('name'),
    link: text('link'),
    x: integer('x').notNull().default(0),
    y: integer('y').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`(unixepoch())`),
});

export type Flower = typeof flowers.$inferSelect;
export type NewFlower = typeof flowers.$inferInsert;
