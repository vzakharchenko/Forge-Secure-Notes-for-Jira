import { IsNotEmpty, IsUUID } from "class-validator";

export class SecurityNoteId {
  @IsNotEmpty()
  @IsUUID("4")
  id!: string;
}
