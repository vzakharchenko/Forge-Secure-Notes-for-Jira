// libs
import { rovo, showFlag } from "@forge/bridge";

// models
import { ResolverNames } from "@shared/ResolverNames";
import { ExportConfig } from "./useExportNotes";

export const useRovoAgent = () => {
  const rovoAgent = async (exportConfig: ExportConfig) => {
    try {
      let prompt: string | undefined;
      switch (exportConfig?.resolverName) {
        case ResolverNames.AUDIT_DATA_PER_USER: {
          prompt = `Prepare an activity report for ${exportConfig?.params?.accountId ? `user ${exportConfig?.params?.accountId}` : "current user"}. Include notes created by them and shared with them. In the final summary, display user names (created_user_name, target_user_name) for better readability.`;
          break;
        }
        case ResolverNames.AUDIT_DATA_PER_ISSUE: {
          prompt = `Prepare an activity report for issue ${exportConfig?.params?.issueId}. In the final summary, display user names (created_user_name, target_user_name) for better readability.`;
          break;
        }
        case ResolverNames.AUDIT_DATA_PER_PROJECT: {
          prompt = `Prepare an activity report for project ${exportConfig?.params?.projectId}. In the final summary, display user names (created_user_name, target_user_name) for better readability.`;
          break;
        }
        case ResolverNames.GET_MY_SECURED_NOTES: {
          prompt = `Prepare an activity report for me. Include notes created by me and shared with me. In the final summary, display user names (created_user_name, target_user_name) for better readability.`;
          break;
        }
        default: {
          prompt = undefined;
        }
      }
      rovo.open({
        type: "forge",
        agentName: "Security Notes analytics",
        agentKey: "security-notes-analytics-agent",
        prompt,
      });

      showFlag({
        id: "openRovoAgentSuccess",
        title: "Opened Rovo Agent",
        type: "success",
        appearance: "success",
        isAutoDismiss: true,
      });
    } catch (error: any) {
      console.error("Opening rovo agent:", error);
      showFlag({
        id: "openRovoAgentError",
        title: "open Rovo Agent failed",
        description: error.message ?? "Failed to open rovo agent.",
        type: "error",
        appearance: "error",
        isAutoDismiss: true,
      });
    }
  };

  return { rovoAgent };
};
