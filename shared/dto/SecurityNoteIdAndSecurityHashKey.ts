import { IsNotEmpty, Length } from "class-validator";

export class SecurityNoteIdAndSecurityHashKey {
  @Length(3, 255)
  @IsNotEmpty()
  id!: string;
  @Length(3, 255)
  @IsNotEmpty()
  keyHash!: string;
}
