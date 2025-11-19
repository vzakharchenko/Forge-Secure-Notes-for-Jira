// libs
import { ReactNode } from "react";

export interface LabelProps {
  id?: string;
  isRequired?: boolean;
  label: string | ReactNode;
  onClick?: () => void;
}
