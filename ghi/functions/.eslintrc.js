module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        'ecmaVersion': 2018,
    },
    extends: [
        'eslint:recommended',
        'google',
    ],
    rules: {
        'no-restricted-globals': ['error', 'name', 'length'],
        'prefer-arrow-callback': 'error',
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'require-jsdoc': 'off',
        'valid-jsdoc': 'off',
    },
    overrides: [
        {
            files: ['**/*.spec.*'],
            env: {
                mocha: true,
            },
            rules: {},
        },
    ],
    globals: {},
};
