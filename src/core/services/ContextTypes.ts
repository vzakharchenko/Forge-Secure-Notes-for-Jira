export interface GeneralContext {
  [key: string]: unknown;
}

export interface Context extends GeneralContext {
  accountId?: string;
  cloudId?: string;
  workspaceId?: string;
  extension: ExtensionData;
  environmentId: string;
  environmentType: string;
  license?: LicenseDetails;
  localId: string;
  moduleKey: string;
  siteUrl: string;
  timezone: string;
  surfaceColor?: string | null;
}
interface ExtensionData {
  [k: string]: unknown;
}
export interface LicenseDetails {
  active: boolean;
  billingPeriod: string;
  ccpEntitlementId: string;
  ccpEntitlementSlug: string;
  isEvaluation: boolean;
  subscriptionEndDate: string | null;
  supportEntitlementNumber: string | null;
  trialEndDate: string | null;
  type: string;
}

export interface BaseContext extends Context {
  accountId: string;
  localId: string;
  cloudId: string;
  moduleKey: string;
  extension: {
    type: string;
  };
}

export interface GlobalJiraContext extends BaseContext {
  accountId: string;
}

export interface Issue {
  key: string;
  id: string;
  type: string;
  typeId: string;
}

export interface Project {
  id: string;
  key: string;
  type: string;
}

export interface IssueContext extends BaseContext {
  extension: {
    issue: Issue;
    project: Project;
    type: string;
  };
}

export const isIssueContext = (context: BaseContext): context is IssueContext =>
  (context as IssueContext).extension?.issue !== undefined &&
  (context as IssueContext).extension?.project !== undefined;
