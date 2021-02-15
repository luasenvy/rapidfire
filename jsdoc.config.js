module.exports = {
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
    tutorials: 'tutorials',
    readme: 'README.md',
    template: 'node_modules/better-docs',
  },
  templates: {
    'better-docs': {
      name: 'RapidFire',
    },
  },
}
