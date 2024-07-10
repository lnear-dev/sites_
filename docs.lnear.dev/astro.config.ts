import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import path from "path";
import links_ from "../_common/src/data/header.json";
const links = links_.map((link) => {
  return {
    label: `${link}.`,
    link: `//${link}.lnear.dev`,
    badge: link === "docs" ? "current" : undefined,
  };
});


// https://astro.build/config
export default defineConfig({
  site: "https://docs.lnear.dev",
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      title: "Docs",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: {
        github: "https://github.com/lnear-dev/",
        twitter: "https://twitter.com/lnearwaju",
      },
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "PHP",
          autogenerate: { directory: "php", collapsed: true },
        },
        {
          label: "TypeScript/JavaScript",
          autogenerate: { directory: "typescript", collapsed: true },
        },
        {
          label: "Archive",
          autogenerate: { directory: "archive", collapsed: true },
        },
      ],
      favicon: "/favicon.svg",
      components: {
        Header: "./src/components/Header.astro",
        MobileMenuFooter: "./src/components/MobileMenuFooter.astro",
      },
    }),
  ],
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
