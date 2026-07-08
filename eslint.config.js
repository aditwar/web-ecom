import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import nextPlugin from 'eslint-config-next';

export default [
  {
    ignores: ['node_modules', '.next'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      next: nextPlugin,
    },
    rules: {
      // contoh aturan tambahan
      '@typescript-eslint/no-unused-vars': [
        'off', // atau "off" kalau mau dimatikan total
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
