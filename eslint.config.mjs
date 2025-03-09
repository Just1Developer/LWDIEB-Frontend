import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import n from 'eslint-plugin-n'
import playwright from 'eslint-plugin-playwright'
import preferArrows from 'eslint-plugin-prefer-arrow-functions'
import prettier from 'eslint-plugin-prettier/recommended'
import promise from 'eslint-plugin-promise'
import regexp from 'eslint-plugin-regexp'
import security from 'eslint-plugin-security'
import sonarjs from 'eslint-plugin-sonarjs'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({ baseDirectory: import.meta.url })

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = tseslint.config(
  js.configs.recommended,
  comments.recommended,
  prettier,
  promise.configs['flat/recommended'],
  regexp.configs['flat/recommended'],
  n.configs['flat/recommended-script'],
  security.configs.recommended,
  sonarjs.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  ...compat.extends('next', 'next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: ['**/test-results', '**/playwright-report', '**/.vercel', '**/node_modules', '**/.next'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'prefer-arrow-functions': preferArrows,
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/indent': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/no-tabs': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'sonarjs/no-ignored-exceptions': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/function-return-type': 'off',
      'sonarjs/no-nested-conditional': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'sonarjs/no-nested-functions': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'promise/catch-or-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'sonarjs/slow-regex': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'sonarjs/no-selector-parameter': 'off',
      'promise/always-return': 'off',
      'sonarjs/no-identical-functions': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@next/next/no-img-element': 'off',
      'no-empty-pattern': 'off',
      'no-empty': 'off',
      'regexp/strict': 'off',
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          allowedNames: [],
          allowNamedFunctions: false,
          allowObjectProperties: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'security/detect-object-injection': 'off',
      'sonarjs/cognitive-complexity': 'warn',
      'sonarjs/no-clear-text-protocols': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
        alwaysTryTypes: true,
        project: import.meta.url,
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
    },
  },
)

export default eslintConfig
