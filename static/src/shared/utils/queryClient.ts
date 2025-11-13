// libs
import { QueryClient } from "@tanstack/react-query";

export const DEFAULT_REACT_QUERY_OPTIONS = {
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
};

export const queryClient = new QueryClient(DEFAULT_REACT_QUERY_OPTIONS);

export const DEFAULT_AP_STALE_TIME = 15 * 60 * 1000; // 15 minutes

export const DEFAULT_STALE_TIME = 15 * 60 * 1000; // 15 minutes

export const DEFAULT_CACHE_TIME = 15 * 60 * 1000; // 15 minutes
