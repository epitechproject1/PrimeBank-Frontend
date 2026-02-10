import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    // 🔕 Fichiers ignorés
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
            /* =====================
               🔒 LIMITATEURS DE CODE
               ===================== */

            // Limite la taille des fonctions
            'max-lines-per-function': ['error', 100],

            // Alerte si fichier trop gros (non bloquant)
            'max-lines': ['warn', 300],

            // Limite l'imbrication (lisibilité)
            'max-depth': ['error', 3],

            // Complexité logique maximale
            complexity: ['error', 12],

            // Interdit `any`
            '@typescript-eslint/no-explicit-any': 'error',

            /* =====================
               ⚛️ BONNES PRATIQUES REACT
               ===================== */

            // Empêche les hooks mal utilisés
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            /* =====================
               🧹 QUALITÉ GÉNÉRALE
               ===================== */

            // Nettoyage variables inutilisées
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],

            // Lisibilité
            'no-nested-ternary': 'error',
        },
    },
])
