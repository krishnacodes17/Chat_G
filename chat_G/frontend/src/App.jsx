import React, { Suspense } from "react";
import { RouterProvider } from "react-router/dom";
import { routes } from "./router/AppRouter";

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
          Loading...
        </div>
      }
    >
      <RouterProvider router={routes} />
    </Suspense>
  );
}

export default App;