import { IsNotEmpty, Length } from "class-validator";

export class SecurityNoteId {
  @Length(3, 255)
  @IsNotEmpty()
  id!: string;
}
