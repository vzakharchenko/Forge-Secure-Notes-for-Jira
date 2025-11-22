import { Length, IsOptional } from "class-validator";

export class SecurityAccountId {
  @IsOptional()
  @Length(3, 255)
  accountId?: string;

  limit?: number;
  offset?: number;
}
