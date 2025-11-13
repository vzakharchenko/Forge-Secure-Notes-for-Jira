// libs
import React, { useEffect, useState } from "react";
import { FullContext } from "@forge/bridge";

// helpers
import { getAppUrl, getForgeContext } from "@src/shared/utils/context";

// components
// import Button from "@atlaskit/button/new";
// import CenterDiv from "src/components/CenterDiv";
import Loading from "@src/components/Loading";
import SecureNoteModal from "@src/modules/SecureNoteModal/SecureNoteModal";
import IssueSection from "@src/modules/IssueSection/IssueSection";
import Administration from "@src/modules/Administration/Administration";

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
      <div style={{ height: "100%" }}>
        <Loading />
      </div>
    );
  }

  if (!context) {
    return "Smth went wrong";
    // TODO: why reload?
    // return (
    //   <CenterDiv>
    //     <Button
    //       height={200}
    //       appearance={"primary"}
    //       onClick={() => {
    //         window.location.reload();
    //       }}
    //     >
    //       RELOAD APPLICATION ${context?.moduleKey}
    //     </Button>
    //   </CenterDiv>
    // );
  }

  // TODO: check context
  console.log("context", context);

  if (context.extension.modal && context.extension.modal.modalType === "newSecureNote") {
    return <SecureNoteModal accountId={context.accountId ?? ""} />;
  }

  switch (context.moduleKey) {
    case "forge-secure-notes-for-jira": {
      return (
        <IssueSection
          accountId={context.accountId ?? ""}
          appUrl={getAppUrl(context)}
          issueId={context.extension.issue.id}
        />
      );
    }
    case "global-page": {
      return <Administration />;
    }
    default: {
      return <div>{context.moduleKey} does not supported</div>;
    }
  }
};

export default ForgeModule;
