// libs
import React, { useEffect, useState } from "react";
import { FullContext } from "@forge/bridge";

// helpers
import { getAppUrl, getForgeContext } from "@src/shared/utils/context";

// components
import SecureNoteModal from "@src/modules/SecureNoteModal/SecureNoteModal";
import IssueSection from "@src/modules/IssueSection/IssueSection";
import AuditGlobal from "@src/modules/AuditGlobal/AuditGlobal";
import { Box } from "@atlaskit/primitives";
import PageLoading from "@src/components/loaders/PageLoading/PageLoading";
import AuditAdmin from "./modules/AuditGlobal/AuditAdmin";
import { getRequestByKey } from "./api/jira/user";
import { CustomerRequest } from "./shared/models/customerRequest";

const ForgeModule = () => {
  const [context, setContext] = useState<FullContext>();
  const [customerRequest, setCustomerRequest] = useState<CustomerRequest>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const initFunc = async () => {
      const ctx = await getForgeContext();
      if (ctx?.extension?.request?.key) {
        try {
          try {
            const cReq = await getRequestByKey(ctx?.extension?.request.key);
            setCustomerRequest(cReq);
          } catch (e) {
            console.warn(e);
          }
        } catch (e) {
          console.error(e);
        }
      } else if (ctx?.extension?.issue?.key) {
        try {
          const cReq = await getRequestByKey(ctx.extension.issue.key);
          setCustomerRequest(cReq);
        } catch (e) {
          console.warn(e);
        }
      }
      setContext(ctx);
    };
    initFunc()
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Box paddingBlockStart="space.1000">
        <PageLoading />
      </Box>
    );
  }

  if (!context) {
    return <div>Something went wrong. Please, refresh the page.</div>;
  }

  if (context.extension.modal && context.extension.modal.modalType === "newSecureNote") {
    return (
      <SecureNoteModal accountId={context!.accountId ?? ""} customerRequest={customerRequest} />
    );
  }

  switch (context.moduleKey) {
    case "forge-secure-notes-portal":
    case "forge-secure-notes-for-jira": {
      return (
        <IssueSection
          accountId={context.accountId ?? ""}
          appUrl={getAppUrl(context)}
          issueId={
            context.extension.issue?.id ?? customerRequest?.issueId ?? context.extension.request.key
          }
          customerRequest={customerRequest}
          timezone={context.timezone}
        />
      );
    }
    case "global-page": {
      return <AuditGlobal timezone={context.timezone} />;
    }
    case "admin-page": {
      return <AuditAdmin timezone={context.timezone} />;
    }
    default: {
      return <div>{context.moduleKey} does not supported</div>;
    }
  }
};

export default ForgeModule;
