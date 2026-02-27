import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),

    {
        files: ['**/*.{ts,tsx}'],

        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],

        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },

        rules: {
            /* 🔒 LIMITATEURS */
            'max-lines-per-function': ['error', 150],
            'max-lines': ['warn', 300],
            'max-depth': ['error', 3],
            complexity: ['error', 16],

            /* ✅ autorise any */
            '@typescript-eslint/no-explicit-any': 'off',

            /* ⚛️ REACT */
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            /* 🧹 QUALITÉ */
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-nested-ternary': 'error',
        },
    },
])