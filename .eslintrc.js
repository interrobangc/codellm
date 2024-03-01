module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:sonarjs/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'sonarjs'],
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-console': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    '@typescript-eslint/dot-notation': 'off',
    'import/extensions': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['cli/tsconfig.json', 'codellm/tsconfig.json'],
      },
    },
  },
  ignorePatterns: [
    '**/dist/**',
    '**/coverage/**',
    'node_modules/**',
    '**/node_modules/**',
    '**/test/**',
    '**/*.test.ts',
    'jest.config.js',
  ],
};
