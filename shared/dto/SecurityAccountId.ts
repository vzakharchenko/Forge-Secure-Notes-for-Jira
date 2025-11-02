import {IsNotEmpty, Length} from "class-validator";

export class SecurityAccountId {
    @Length(3, 255)
    @IsNotEmpty()
    accountId!: string;
}