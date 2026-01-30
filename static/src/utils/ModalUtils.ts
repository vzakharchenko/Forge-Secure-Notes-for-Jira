import { Modal } from "@forge/bridge";

export async function showNewIssueModal(callback: (payload: any) => any, accountId?: string) {
  try {
    const modal = new Modal({
      resource: "main",
      onClose: callback,
      size: "large",
      context: {
        modalType: "newSecureNote",
        accountId,
      },
    });

    await modal.open();
  } catch (e) {
    console.error(e);
  }
}
