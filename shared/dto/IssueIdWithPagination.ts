import { IsInt, IsNotEmpty, Length, Max, Min } from "class-validator";

export class IssueIdWithPagination {
  @Length(3, 255)
  @IsNotEmpty()
  issueId!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;
  @IsInt()
  @Min(0)
  @Max(1000)
  offset!: number;
}
