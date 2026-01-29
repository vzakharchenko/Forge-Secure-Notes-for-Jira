import { Length, IsOptional, IsInt, Min, Max } from "class-validator";

export class SecurityAccountId {
  @IsOptional()
  @Length(3, 255)
  accountId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  offset?: number;
}
