import {ErrorResponse} from "../Types";

export interface SecurityNoteData extends ErrorResponse{
    id: string
    iv: string,
    salt: string,
    expiry:string,
    encryptedData: string,
    viewTimeOut: number
}
