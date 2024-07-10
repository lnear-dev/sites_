import { defineConfig } from "astro/config";
import path from "path";
export default defineConfig({
  site: "https://ascii.lnear.dev",
  vite: {
    resolve: {
      alias: {
        "@common": path.resolve(
          path.dirname(new URL(import.meta.url).pathname),
          "../_common"
        ),
      },
    },
  },
});
