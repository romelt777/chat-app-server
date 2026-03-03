import tseslint from "typescript-eslint";
import path from "path"
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: "./tsconfig.json",
            },
        },
    }
);