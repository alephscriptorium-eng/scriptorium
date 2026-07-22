import { defineConfig } from 'vitepress';

/**
 * Site-web overall · aleph-null (DA-S02).
 * Método: skill site-web · protocolo-ghpages (base + guard MSYS = frágil #2).
 */
function resolveDocsBase() {
  const raw = process.env.DOCS_BASE?.trim();
  if (raw) {
    if (/^[A-Za-z]:[\\/]/.test(raw)) return '/';
    const cleaned = raw.replace(/^\/+|\/+$/g, '');
    return cleaned ? `/${cleaned}/` : '/';
  }
  return '/';
}

/** Fuente única de back-links (B11 / DC-24). */
const BACK = {
  repo: 'https://github.com/alephscriptorium-eng/scriptorium',
  registry: 'https://npm.scriptorium.escrivivir.co',
  actions: 'https://github.com/alephscriptorium-eng/scriptorium/actions',
  pages: 'https://aleph-null.escrivivir.co',
  changelog: 'https://github.com/alephscriptorium-eng/scriptorium/blob/main/CHANGELOG.md',
  issues: 'https://github.com/alephscriptorium-eng/scriptorium/issues'
};

const backLinks = [
  { text: 'Repositorio', link: BACK.repo },
  { text: 'Registry', link: BACK.registry },
  { text: 'CI / Actions', link: BACK.actions },
  { text: 'Pages', link: BACK.pages },
  { text: 'CHANGELOG', link: BACK.changelog },
  { text: 'Issues', link: BACK.issues }
];

export default defineConfig({
  title: 'aleph-null',
  description: 'Scriptorium — site-web overall del workspace',
  lang: 'es',
  base: resolveDocsBase(),
  cleanUrls: true,
  ignoreDeadLinks: false,
  themeConfig: {
    back: BACK,
    backLinks,
    nav: [
      { text: 'Portada', link: '/' },
      { text: 'Constelación', link: '/constelacion' },
      { text: 'Método', link: '/metodo' },
      { text: 'Ciudad', link: '/ciudad' },
      { text: 'Cola', link: '/cola' },
      { text: 'Proyecto', link: '/proyecto' }
    ],
    sidebar: [
      {
        text: 'aleph-null',
        items: [
          { text: 'Portada', link: '/' },
          { text: 'Constelación', link: '/constelacion' },
          { text: 'Método', link: '/metodo' },
          { text: 'Ciudad', link: '/ciudad' },
          { text: 'Cola', link: '/cola' },
          { text: 'Proyecto', link: '/proyecto' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: BACK.repo }],
    outline: { level: [2, 3] },
    search: { provider: 'local' },
    footer: {
      message: backLinks
        .map(
          (l) =>
            `<a href="${l.link}" target="_blank" rel="noreferrer">${l.text}</a>`
        )
        .join('<span aria-hidden="true"> · </span>'),
      copyright: 'aleph-null · scriptorium'
    }
  }
});
