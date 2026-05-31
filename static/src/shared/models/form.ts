// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

export interface Lookup<LookupT = string> {
  label: string;
  value: LookupT;
}
