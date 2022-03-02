const options = {
  plugins: ['node_modules/jsdoc/plugins/markdown'],
  source: {
    include: ['src'],
    includePattern: '\\.(js)$',
  },
  plugins: ['jsdoc-mermaid'],
  opts: {
    encoding: 'utf8',
    destination: 'docs',
    recurse: true,
    tutorials: 'docs-src/tutorials',
    readme: 'README.md',
    template: 'node_modules/better-docs',
  },
  templates: {
    default: {
      staticFiles: {
        include: ['docs-src/statics'],
      },
    },
    'better-docs': {
      logo: 'images/logo.svg',
      title: ':: RapidFire :: Express Based WebServer Framework',
      hideGenerator: false,
      navLinks: [{ label: 'Github', href: '//github.com/luasenvy/rapidfire' }],
    },
  },
}

module.exports = options
