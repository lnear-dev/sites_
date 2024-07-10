import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";

import path from "path";
import links_ from "../_common/src/data/header.json";
const links = links_.map((link) => {
  return {
    label: `${link}.`,
    link: `//${link}.lnear.dev`,
    badge: link === "blog" ? "current" : undefined,
  };
});


// https://astro.build/config
export default defineConfig({
  site: "https://blog.lnear.dev",
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      title: "Blog",
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
          label: "Posts",
          autogenerate: { directory: "posts", collapsed: true },
        },
        {
          label: "News",
          autogenerate: { directory: "news", collapsed: true },
        }
      ],
      favicon: "/favicon.svg",
      expressiveCode: {
        themes: ["vitesse-black", "starlight-light"],
      },
      components: {
        Header: "./src/components/Header.astro",
        MobileMenuFooter: "./src/components/MobileMenuFooter.astro",
      },
    }),
    // liveCode()
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
