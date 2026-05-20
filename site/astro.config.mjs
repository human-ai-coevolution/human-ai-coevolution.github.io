import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import solid from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';

// User/org Pages site: serves at https://human-ai-coevolution.github.io/
// with no project subpath, so BASE defaults to empty. The deploy
// workflow overrides both via env vars derived from GITHUB_REPOSITORY.
const SITE_URL = process.env.SITE_URL ?? 'https://human-ai-coevolution.github.io';
const BASE = process.env.BASE_PATH ?? '';

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    solid(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      filter: (page) =>
        !page.includes('/404') && !page.endsWith('rss.xml') && !page.endsWith('rss.xml/'),
      serialize(item) {
        if (!item || !item.url) return undefined;
        if (/\/papers\/?$/.test(item.url)) item.priority = 0.9;
        else if (/\/(stats|adjacent|about)\/?$/.test(item.url)) item.priority = 0.7;
        else if (/\/papers\//.test(item.url)) item.priority = 0.6;
        else item.priority = 1.0;
        return item;
      },
    }),
  ],
  build: {
    format: 'directory',
  },
  vite: {
    ssr: {
      noExternal: ['echarts'],
    },
  },
});
