// libs
import { showFlag } from "@forge/bridge";
import { v4 as uuidv4 } from "uuid";

export const showSuccessFlag = (props?: { title: string; description?: string }) => {
  showFlag({
    id: uuidv4(),
    type: "success",
    title: props?.title || "Success",
    description: props?.description || "",
    isAutoDismiss: true,
  });
};

export const showInfoFlag = (props?: { title: string; description?: string }) => {
  showFlag({
    id: uuidv4(),
    type: "info",
    title: props?.title || "Info",
    description: props?.description || "",
    isAutoDismiss: true,
  });
};

export const showWarningFlag = (props?: { title: string; description?: string }) => {
  showFlag({
    id: uuidv4(),
    type: "warning",
    title: props?.title || "Warning",
    description: props?.description || "",
    isAutoDismiss: true,
  });
};

export const showErrorFlag = (props?: { title: string; description?: string }) => {
  showFlag({
    id: uuidv4(),
    type: "error",
    title: props?.title || "Error",
    description: props?.description || "",
    isAutoDismiss: true,
  });
};
