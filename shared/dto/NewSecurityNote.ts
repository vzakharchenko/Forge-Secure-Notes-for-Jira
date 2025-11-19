import { ArrayNotEmpty, IsArray, IsNotEmpty, Length } from "class-validator";

export class NewSecurityNote {
  @ArrayNotEmpty()
  @IsArray()
  targetUsers!: { accountId: string; userName: string }[];
  @Length(2, 24)
  @IsNotEmpty()
  expiry!: string;
  isCustomExpiry?: boolean;
  @Length(3, 255)
  @IsNotEmpty()
  encryptionKeyHash!: string;
  @IsNotEmpty()
  encryptedPayload!: string;
  @Length(3, 255)
  @IsNotEmpty()
  iv!: string;
  @Length(3, 255)
  @IsNotEmpty()
  salt!: string;
  @Length(3, 255)
  @IsNotEmpty()
  description!: string;
}
