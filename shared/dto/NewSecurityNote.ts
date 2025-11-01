import {IsNotEmpty, Length} from "class-validator";

export class NewSecurityNote {
    @Length(3, 255)
    @IsNotEmpty()
    targetUser!: string;
    @Length(3, 255)
    @IsNotEmpty()
    targetUserName!: string;
    @Length(2, 20)
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
}