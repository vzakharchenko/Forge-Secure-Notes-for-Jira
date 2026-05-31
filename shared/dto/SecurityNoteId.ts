// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { IsNotEmpty, IsUUID } from "class-validator";

export class SecurityNoteId {
  @IsNotEmpty()
  @IsUUID("4")
  id!: string;
}
