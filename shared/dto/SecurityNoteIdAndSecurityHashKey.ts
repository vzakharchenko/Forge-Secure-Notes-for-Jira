// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { IsNotEmpty, IsUUID, Length } from "class-validator";

export class SecurityNoteIdAndSecurityHashKey {
  @IsNotEmpty()
  @IsUUID("4")
  id!: string;
  @Length(3, 255)
  @IsNotEmpty()
  keyHash!: string;
}
