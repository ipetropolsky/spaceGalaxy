module.exports = {
    root: true,
    extends: ['@hh.ru/eslint-config', 'prettier', 'prettier/standard'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error'],
        'no-restricted-syntax': 'off',
        'prefer-rest-params': 'off',
        'class-methods-use-this': 'off',
        'no-plusplus': 'off',
        'no-console': 'off',
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: './webpack/base.js',
            },
        },
        'import/extensions': ['.js'],
    },
};
