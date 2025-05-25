import Resolver from "@forge/resolver";
import OpenSecurityNoteController from "../../controllers/global/OpenSecurityNoteController";
import FetchSecurityNoteController from "../../controllers/global/FetchSecurityNoteController";

export default function (resolver: Resolver): void {
    OpenSecurityNoteController.register(resolver);
    FetchSecurityNoteController.register(resolver);
}
