import React from "react";
import { ToastContainer } from "react-toastify";
import { useTheme } from "../hooks/themeContext";

function ThemedToastContainer() {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme={theme}
      toastStyle={{
        borderRadius: "14px",
        fontSize: "13px",
        fontWeight: "600",
      }}
    />
  );
}

export default ThemedToastContainer;