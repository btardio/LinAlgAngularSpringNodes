module.exports = {
    out: './documentation/',

    readme: 'none',
    includes: './',
    exclude: [
        '**/*.spec.ts**',
    ],
    module: 'commonjs',
    mode: 'file',
    excludeExternals: true,
    excludeNotExported: true,
    excludePrivate: true
};