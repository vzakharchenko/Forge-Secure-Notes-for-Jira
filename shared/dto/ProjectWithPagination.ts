import { IsInt, IsNotEmpty, Length, Max, Min } from "class-validator";

export class ProjectWithPagination {
  @Length(1, 255)
  @IsNotEmpty()
  projectId!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;
  @IsInt()
  @Min(0)
  @Max(1000)
  offset!: number;
}
