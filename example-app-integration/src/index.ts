import Resolver, { Request } from "@forge/resolver";
import ForgeSQL, {
  applySchemaMigrations,
  dropSchemaMigrations,
  fetchSchemaWebTrigger,
} from "forge-sql-orm";
import migration from "./migration";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { secureNotes } from "./entities";

export const FORGE_SQL_ORM = new ForgeSQL({
  logRawSqlQuery: true,
  cacheEntityName: "cache",
  cacheTTL: 180,
});

const selectSecureNotes = createSelectSchema(secureNotes);

const insertSecureNotes = createInsertSchema(secureNotes);

type SavePayloadInput = z.input<typeof insertSecureNotes>;
type SavePayload = z.infer<typeof insertSecureNotes>;

const resolver = new Resolver();

resolver.define("fetch", async (req: Request<{ offset: number; limit: number }>) => {
  const fetchSchema = z
    .object({
      offset: z.number().int().nonnegative().default(0),
      limit: z.number().int().positive().max(100).default(10),
    })
    .strict();

  const { offset, limit } = fetchSchema.parse((req.payload ?? {}) as unknown);

  return await FORGE_SQL_ORM.selectFrom(secureNotes).limit(limit).offset(offset);
});

resolver.define("save", async (req: Request<SavePayloadInput>) => {
  const parsed: SavePayload = insertSecureNotes.parse(req.payload);

  await FORGE_SQL_ORM.insert(secureNotes).values(parsed);

  return;
});

export const handler = resolver.getDefinitions();

export const handlerMigration = async () => {
  return await applySchemaMigrations(migration as any);
};

export const dropMigrations = () => {
  return dropSchemaMigrations();
};

export const fetchMigrations = () => {
  return fetchSchemaWebTrigger();
};
