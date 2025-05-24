import {ErrorResponse} from "../Types";
import {ViewMySecurityNotes} from "./ViewMySecurityNotes";


export interface ViewMySecurityNotesList extends ErrorResponse {
    result: ViewMySecurityNotes[];
}
