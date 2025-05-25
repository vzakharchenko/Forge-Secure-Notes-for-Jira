import Resolver from "@forge/resolver";
import getMySecurityNotesController from "../../controllers/issue/GetMySecurityNotesController";
import createSecurityNoteController from "../../controllers/issue/CreateSecurityNoteController";
import deleteSecurityNoteController from "../../controllers/issue/DeleteSecurityNoteController";

export default function (resolver: Resolver): void {
    getMySecurityNotesController.register(resolver)
    createSecurityNoteController.register(resolver)
    deleteSecurityNoteController.register(resolver)
}
