import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./shared/hooks/themeContext.jsx";
import ThemedToastContainer from "./shared/ui/ThemedToastContainer.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ThemedToastContainer />
      <App />
    </ThemeProvider>
  </QueryClientProvider>,
);