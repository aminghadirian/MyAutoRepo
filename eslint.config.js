// ESLint flat config (ESLint 9)
export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "coverage/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Browser globals used in app.js
        document:      "readonly",
        localStorage:  "readonly",
        confirm:       "readonly",
        clearInterval: "readonly",
        setInterval:   "readonly",
        Date:          "readonly",
        JSON:          "readonly",
        Math:          "readonly",
        Set:           "readonly",
        String:        "readonly",
        Number:        "readonly",
        Boolean:       "readonly",
        Object:        "readonly",
        Array:         "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "eqeqeq":         ["error", "always"],
      "no-var":         "error",
      "prefer-const":   "warn",
      "no-console":     "warn",
    },
  },
];
