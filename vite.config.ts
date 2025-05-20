import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(
  ({ mode }: { mode: string }): UserConfig => ({
    base: mode === "production" ? "/react-study/" : "/",
    plugins: [react()],
  })
);
