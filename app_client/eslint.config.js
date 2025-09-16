import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";



/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        plugins: {
            ...pluginReact.configs.flat.recommended.plugins,
            "unused-imports": unusedImports,
        },
        rules: {
            ...pluginReact.configs.flat.recommended.rules,
            "react/react-in-jsx-scope": "off",  // Disable the rule
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "prefer-const": "off",
            "react/no-unescaped-entities": "off",
            "no-var": "off",
            "react/prop-types": "off",
            "no-empty": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "unused-imports/no-unused-imports": "warn",
        }
    }
];
