// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require('./tsconfig.json');

const config = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:sonarjs/recommended',
    'plugin:typescript-sort-keys/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  ignorePatterns: [
    '**/build/**',
    '**/dist/**',
    '**/coverage/**',
    'node_modules/**',
    '**/node_modules/**',
  ],
  overrides: [
    // React
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      settings: {
        formComponents: ['Form'],
        'import/resolver': {
          typescript: {
            project: './tsconfig.eslint.json',
          },
        },
        linkComponents: [
          { linkAttribute: 'to', name: 'Link' },
          { linkAttribute: 'to', name: 'NavLink' },
        ],
        react: {
          version: 'detect',
        },
      },
    },
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
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'react',
    'sonarjs',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
    'react',
    'jsx-a11y',
  ],
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/dot-notation': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      { ts: 'never', tsx: 'never' },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/tests/**',
          '**/*.test.{ts,tsx}',
          '**/.eslintrc.cjs',
          '**/vite.config.{js,ts}',
          '**/tailwind.config.{js,ts}',
        ],
        optionalDependencies: false,
        packageDir: [
          './',
          ...tsConfig.references.map((ref) => `./${ref.path}`),
        ],
      },
    ],
    'jsx-a11y/no-autofocus': 'off',
    'no-console': 'error',
    'sonarjs/prefer-single-boolean-return': 'off',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [
          'cli/tsconfig.json',
          'codellm/tsconfig.json',
          'remix/tsconfig.json',
        ],
      },
    },
  },
};

module.exports = config;
