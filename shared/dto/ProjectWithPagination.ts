import { IsNotEmpty, Length } from "class-validator";

export class ProjectWithPagination {
  @Length(3, 255)
  @IsNotEmpty()
  projectId!: string;

  limit!: number;
  offset!: number;
}
