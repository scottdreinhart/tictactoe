import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import prettierConfig from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
      boundaries,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ── React ──
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-no-useless-fragment': 'warn',

      // ── React Hooks ──
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ── TypeScript ──
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',

      // ── Code quality ──
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['warn', 'multi-line'],
      'no-throw-literal': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-nested-ternary': 'warn',
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'no-useless-rename': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-unneeded-ternary': 'warn',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'prefer-spread': 'warn',
      'prefer-rest-params': 'error',
      'no-array-constructor': 'error',
      'no-new-wrappers': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-with': 'error',
      'no-label-var': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'no-return-assign': ['error', 'always'],
      'no-sequences': 'error',
      'no-self-compare': 'error',
      'no-extend-native': 'error',
      'no-iterator': 'error',
      'no-proto': 'error',
      'no-multi-assign': 'error',

      // ── Import hygiene ──
      'no-duplicate-imports': 'error',
      'sort-imports': ['warn', { ignoreCase: true, ignoreDeclarationSort: true }],
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // ── Accessibility (jsx-a11y) ──
      ...jsxA11y.flatConfigs.recommended.rules,

      // ── CLEAN Architecture Boundaries ──
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'domain', allow: ['domain'] },
            { from: 'app', allow: ['domain', 'app'] },
            { from: 'ui', allow: ['domain', 'app', 'ui'] },
            { from: 'workers', allow: ['domain'] },
            { from: 'themes', allow: [] },
          ],
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain/**' },
        { type: 'app', pattern: 'src/app/**' },
        { type: 'ui', pattern: 'src/ui/**' },
        { type: 'workers', pattern: 'src/workers/**' },
        { type: 'themes', pattern: 'src/themes/**' },
      ],
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
]
