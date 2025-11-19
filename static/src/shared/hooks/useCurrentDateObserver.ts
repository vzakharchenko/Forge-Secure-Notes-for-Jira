// libs
import { useCallback, useEffect, useRef } from "react";

// helpers
import { dateNow, formatDateWithTimezoneAndFormat } from "@src/shared/utils/date";

// constants
import { DATE_FORMATS } from "@src/shared/constants/formates";

const selectCurrentDate = (element: HTMLElement | null, timezone: string) => {
  if (!element) return;

  const currentInvalidDateElement = element.querySelector('[data-today="true"]');
  if (currentInvalidDateElement) {
    const selectedCurrentDate = currentInvalidDateElement.getAttribute("aria-label");
    const currentDate = formatDateWithTimezoneAndFormat(
      dateNow(),
      timezone,
      DATE_FORMATS.DATE_PICKER_CELL,
    );
    if (selectedCurrentDate !== currentDate) {
      currentInvalidDateElement.removeAttribute("data-today");
      const currentDateElement = element.querySelector(`[aria-label="${currentDate}"]`);
      if (currentDateElement) {
        currentDateElement.setAttribute("data-today", "true");
      }
    }
  }
};

export const useCurrentDateObserver = (timezone: string) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  const updateCurrentDate = useCallback(
    (mutations: MutationRecord[]) => {
      const isClosing = Boolean(
        mutations.find(
          (mutation) => mutation.type === "attributes" && mutation.oldValue === "true",
        ),
      );
      if (!isClosing) {
        selectCurrentDate(ref.current, timezone);
      }
    },
    [timezone],
  );

  useEffect(() => {
    if (ref.current) {
      updateCurrentDate([]);
      mutationObserverRef.current = new MutationObserver(updateCurrentDate);

      mutationObserverRef.current.observe(ref.current, {
        characterData: true,
        attributes: true,
        attributeFilter: ["aria-expanded"],
        attributeOldValue: true,
        subtree: true,
      });
    }

    return () => {
      mutationObserverRef.current?.disconnect();
    };
  }, [updateCurrentDate]);

  return ref;
};
