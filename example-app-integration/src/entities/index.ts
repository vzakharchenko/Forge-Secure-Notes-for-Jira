export * from "./schema";

export interface VersionFieldMetadata {
  fieldName: string;
}

export interface TableMetadata {
  tableName: string;
  versionField: VersionFieldMetadata;
}

export type AdditionalMetadata = Record<string, TableMetadata>;

export const additionalMetadata: AdditionalMetadata = {};
