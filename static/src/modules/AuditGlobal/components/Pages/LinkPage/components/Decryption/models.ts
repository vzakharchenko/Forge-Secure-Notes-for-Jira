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
