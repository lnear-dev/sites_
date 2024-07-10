import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.lnear.dev",
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      components: {
        Head: "./src/component/Head.astro",
        MobileMenuFooter: "./src/component/MobileMenuFooter.astro",
        SocialIcons: "./src/component/SocialIcons.astro",
      },
      title: "Docs",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: {
        github: "https://github.com/lnear-dev/",
        twitter: "https://twitter.com/lnearwaju",
      },
      customCss: ["./src/style.css"],
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
    }),
  ],
  // vite: {
  //   resolve: {
  //     alias: {
  //       "@common": path.resolve(
  //         path.dirname(new URL(import.meta.url).pathname),
  //         "../_common"
  //       ),
  //     },
  //   },
  //   ssr: {
  //     noExternal: ["common", "starlight-common"],
  //   },
  // },
});
