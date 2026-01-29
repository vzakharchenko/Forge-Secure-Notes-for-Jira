import { IsNotEmpty, IsUUID, Length } from "class-validator";

export class SecurityNoteIdAndSecurityHashKey {
  @IsNotEmpty()
  @IsUUID("4")
  id!: string;
  @Length(3, 255)
  @IsNotEmpty()
  keyHash!: string;
}
