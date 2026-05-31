// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// libs
import { useEffect, useRef, useState } from "react";

export const useHasScrollBar = <T extends HTMLElement>(
  shouldValidate = true,
  revalidateAnchor?: unknown,
) => {
  const ref = useRef<T | null>(null);
  const [hasScrollBar, setHasScrollBar] = useState(false);

  useEffect(() => {
    if (!shouldValidate) return;
    const element = ref.current;
    if (element) {
      setHasScrollBar(element.scrollHeight > element.clientHeight);
    }
  }, [shouldValidate, revalidateAnchor, ref.current?.scrollHeight]);

  return { ref, hasScrollBar };
};
