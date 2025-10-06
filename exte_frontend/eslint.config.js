import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: importPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Existing rules
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      
      // Circular dependency prevention rules
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      
      // Prevent problematic import patterns
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../contexts.jsx'],
              message: 'Use direct imports from contexts directory instead of barrel file'
            },
            {
              group: ['../services/api.js'],
              message: 'Use direct imports from services directory instead of barrel file'
            }
          ]
        }
      ],
      
      // Basic React rules
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error'
    },
  },
])
