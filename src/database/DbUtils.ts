// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import ForgeSQL from "forge-sql-orm-extra";
import { additionalMetadata } from "./entities";

export const FORGE_SQL_ORM = new ForgeSQL({
  additionalMetadata: additionalMetadata,
  logRawSqlQuery: false,
  cacheEntityName: "cache",
  cacheTTL: 900,
  logCache: false,
});
