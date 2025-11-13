// libs
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

// helpers
import { queryClient } from "@src/shared/utils/queryClient";

// components
import ForgeModule from "@src/ForgeModule";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ForgeModule />
    </QueryClientProvider>
  );
};

export default App;
