module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'no-restricted-syntax': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
    'parser': '@typescript-eslint/parser',
    quotes: ['error', 'single'],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd'],
      },
    ],
    'import/extensions': 0,
    'max-len': [
      'warn',
      {
        code: 160,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-continue': 0,
    'no-plusplus': 0
  },
};
