module.exports = {
    root: true,
    extends: ['@hh.ru/eslint-config', 'prettier', 'prettier/standard'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error'],
        'no-restricted-syntax': 'off',
        'prefer-rest-params': 'off',
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: './webpack/base.js',
            },
        },
    },
};
