module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // 开启 prettier 自动修复的功能
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['404'],
      },
    ],
  },
};
