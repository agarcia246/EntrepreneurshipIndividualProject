import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            boxShadow: "var(--shadow-elevated)",
          },
        }}
        richColors
      />
    </AuthProvider>
  );
}
