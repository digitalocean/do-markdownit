'use strict';

module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true, // https://node.green/#ES2021 16.10.0 is 100% complete
    },
    extends: [
        'airbnb-base',
        'plugin:jsdoc/recommended',
    ],
    plugins: [
        'jsdoc',
    ],
    settings: {
        jsdoc: {
            mode: 'typescript',
            preferredTypes: {
                object: 'Object',
            },
        },
    },
    parserOptions: {
        sourceType: 'script',
    },
    overrides: [
        {
            files: '*.test.js',
            env: {
                jest: true,
            },
        },
    ],
    rules: {
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'arrow-parens': [
            'error',
            'as-needed',
        ],
        'arrow-spacing': 'error',
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'array-bracket-spacing': [
            'error',
            'always',
        ],
        'no-console': 'off',
        'no-var': 'error',
        'prefer-const': 'error',
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        semi: [
            'error',
            'always',
        ],
        quotes: [
            'error',
            'single',
        ],
        'quote-props': [
            'error',
            'as-needed',
        ],
        'object-curly-newline': [
            'error',
            {
                multiline: true,
                consistent: true,
            },
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true,
            },
        ],
        'comma-style': [
            'error',
            'last',
        ],
        'eol-last': 'error',
        'key-spacing': [
            'error',
            {
                beforeColon: false,
                afterColon: true,
            },
        ],
        'keyword-spacing': [
            'error',
            {
                before: true,
                after: true,
            },
        ],
        'block-spacing': 'error',
        'space-in-parens': [
            'error',
            'never',
        ],
        'space-before-blocks': 'error',
        'no-trailing-spaces': 'error',
        'semi-spacing': [
            'error',
            {
                before: false,
                after: true,
            },
        ],
        'space-infix-ops': 'error',
        'linebreak-style': [
            'error',
            'unix',
        ],
        'max-len': [
            'error',
            {
                code: 120,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        strict: [
            'error',
            'safe',
        ],
        'no-param-reassign': [
            'error',
            {
                props: false,
            },
        ],
        'no-restricted-syntax': 'off',
        'global-require': 'off',
        'no-continue': 'off',
        'prefer-destructuring': [
            'error',
            {
                object: true,
                array: false,
            },
        ],
        'jsdoc/require-returns-description': 'off',
        'jsdoc/tag-lines': 'off',
        'jsdoc/no-undefined-types': [
            'error',
            {
                definedTypes: [ 'Node' ],
            },
        ],
        'jsdoc/require-jsdoc': [
            'error',
            {
                require: {
                    ArrowFunctionExpression: true,
                    ClassDeclaration: true,
                    ClassExpression: true,
                    FunctionDeclaration: true,
                    FunctionExpression: true,
                    MethodDefinition: true,
                },
            },
        ],
    },
};
