import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      theme="dark"
      toastOptions={{
        style: {
          background: "var(--surface-2)",
          border: "1px solid var(--line-strong)",
          color: "var(--fg)",
        },
      }}
    />
  );
}
