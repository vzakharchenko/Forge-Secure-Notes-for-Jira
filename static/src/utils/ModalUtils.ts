// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { Modal } from "@forge/bridge";

export async function showNewIssueModal(callback: (payload: any) => any) {
  try {
    const modal = new Modal({
      resource: "main",
      onClose: callback,
      size: "large",
      context: {
        modalType: "newSecureNote",
      },
    });

    await modal.open();
  } catch (e) {
    console.error(e);
  }
}
