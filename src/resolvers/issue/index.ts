import Resolver from "@forge/resolver";
import getMySecurityNotesController from "../../controllers/issue/GetMySecurityNotesController";

export default function (resolver: Resolver): void {
    getMySecurityNotesController.register(resolver)
}
