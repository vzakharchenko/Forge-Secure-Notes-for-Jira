// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { invoke } from "@forge/bridge";

export type InvokePayload = NonNullable<Parameters<typeof invoke>[1]>;

// @forge/bridge >= 7 types the result as `T | { body: T; metadata }`.
// We never request invoke metadata, so the response is always the plain body.
export const invokeBody = async <T>(functionKey: string, payload?: InvokePayload): Promise<T> =>
  (await invoke<T>(functionKey, payload)) as T;
