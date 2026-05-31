// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

export interface DecryptionProps {
  sourceAccountId: string;
  recordId?: string;
  setIsValid: (value: boolean) => void;
  setIsClosed: (value: boolean) => void;
  setDecryptedContent: (value: string) => void;
}

export interface DecryptionFormContainerProps {
  sourceAccountId: string;
  recordId?: string;
  setIsValid: (value: boolean) => void;
  setIsClosed: (value: boolean) => void;
  setDecryptedContent: (value: string) => void;
}

export interface DecryptionFormFields {
  decryptionKey: string;
}
