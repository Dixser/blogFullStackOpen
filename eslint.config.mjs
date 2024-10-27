import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    plugins: {
      '@stylistic': stylistic,
    },

    rules: {
      extends: [
        '@eslint-recommended',
        // add other rulesets here if needed
      ],
      indent: ['error', 2],
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
    },
  },
  { ignores: ['node_modules', 'dist'] },
]

