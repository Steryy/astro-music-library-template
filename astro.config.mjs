import { defineConfig } from 'astro/config';
import qwikdev from "@qwikdev/astro";
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [qwikdev(), tailwind(), icon()]
});