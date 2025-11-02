import { IsNotEmpty, Length } from "class-validator";

export class IssueIdWithPagination {
  @Length(3, 255)
  @IsNotEmpty()
  issueId!: string;

  limit!: number;
  offset!: number;
}
