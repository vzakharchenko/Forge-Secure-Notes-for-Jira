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

const ForgeModule = () => {
  const [context, setContext] = useState<FullContext>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getForgeContext()
      .then(setContext)
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
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
    return <SecureNoteModal accountId={context!.accountId ?? ""} />;
  }

  switch (context.moduleKey) {
    case "forge-secure-notes-for-jira": {
      return (
        <IssueSection
          accountId={context.accountId ?? ""}
          appUrl={getAppUrl(context)}
          issueId={context.extension.issue.id}
          timezone={context.timezone}
        />
      );
    }
    case "global-page": {
      return <AuditGlobal timezone={context.timezone} />;
    }
    default: {
      return <div>{context.moduleKey} does not supported</div>;
    }
  }
};

export default ForgeModule;
