import js from "@eslint/js";
import globals from "globals";

export default [
    {
        files: ["prac1cicd/js/**/*.js"],
        languageOptions: {
            globals: globals.browser
        },
        rules: js.configs.recommended.rules
    }
];
