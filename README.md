# Issue

<https://github.com/prettier/prettier-vscode/issues/3380>

## Environments

- Operating System: Windows 11
- VSCode version: 1.88.1
- Runtime: Node.js v20
- Prettier Version: 3.2.5
- Prettier Plugins (if any): `prettier-plugin-tailwindcss` or any others plugins
- Prettier Extension Version: 10.4.0

## Description

I'm trying to setup a project with `yarn 4 + pnp` + `prettier` + `prettier-plugin-tailwindcss` (or any others plugins) but I got some problems.

In the configuration file, if plugins are declared as string:

```js
//.prettier.mjs
/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: ["prettier-plugin-tailwindcss"],
};

export default prettierConfig;
```

The command `yarn prettier .` will return the following error:

```log
[error] Cannot find package 'prettier-plugin-tailwindcss' imported from D:\Code\issue\prettier-yarn-issue\noop.js
```

This is a known bug and has been reported previously in prettier repository ([prettier#13276](https://github.com/prettier/prettier/issues/13276), [prettier#15388](https://github.com/prettier/prettier/issues/15388)).

This bug can be fixed with a workaround via `require.resolve()` or `import()`.

However, despite the command `yarn prettier .` can be run, prettier extension in VSCode still can't work.

## Github Repository to Reproduce Issue

Issue reproduction repo: [prettier-yarn-issue](https://github.com/issue-reproduction/prettier-yarn-issue).

I have already run the command `yarn dlx @yarnpkg/sdks vscode` and committed the changes to the repo.

| Branch                                                                                                            | Config | Plugins syntax      | `yarn prettier .` | `prettier-vscode` | VSCode output & behavior                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ------ | ------------------- | ----------------- | ----------------- | ------------------------------------------------------------------------------ |
| [`yarn-4-pnp/cjs/string`](https://github.com/issue-reproduction/prettier-yarn-issue/tree/yarn-4-pnp/cjs/string)   | cjs    | string              | ❌                 | ❌                 | [Error resolve node module](#log---error-resolve-node-module)                  |
| [`yarn-4-pnp/mjs/string`](https://github.com/issue-reproduction/prettier-yarn-issue/tree/yarn-4-pnp/mjs/string)   | mjs    | string              | ❌                 | ❌                 | [Error resolve node module](#log---error-resolve-node-module)                  |
| [`yarn-4-pnp/cjs/require`](https://github.com/issue-reproduction/prettier-yarn-issue/tree/yarn-4-pnp/cjs/require) | cjs    | `require.resolve()` | ✔                 | ❌                 | [Error cannot find package](#log---cannot-find-package-prettier-imported-from) |
| [`yarn-4-pnp/mjs/import`](https://github.com/issue-reproduction/prettier-yarn-issue/tree/yarn-4-pnp/mjs/import)   | mjs    | `import()`          | ✔                 | ❌                 | Loading forever...                                                             |

## Steps To Reproduce

1. Checkout to the correct branch (`main` branch doesn't have the prettier config).
2. *(Optional)* Use volta for install the correct node & yarn version.
3. Run `yarn install`.
4. Open repo in vscode (or run command `Developer: Restart Extension Host` if it's already opened).
5. Open `src/index.ts`.
6. Run command `Format document with...` > `Prettier - Code formatter`.

## Expected result

If command `yarn prettier .` can run via the above workaround (require.resolve or import), `prettier-vscode` must also run.

## Actual result

Command `yarn prettier .` can run via the above workaround (require.resolve or import) but `prettier-vscode` can't run.

## Prettier Log Output

### Log - Error resolve node module

```log
["DEBUG" - 11:25:25 AM] Local prettier module path: d:\Code\issue\prettier-yarn-issue\.yarn\sdks\prettier\index.cjs
["INFO" - 11:25:25 AM] Using config file at d:\Code\issue\prettier-yarn-issue\.prettierrc.cjs
["ERROR" - 11:25:25 AM] Error handling text editor change
["ERROR" - 11:25:25 AM] Error resolve node module 'prettier-plugin-tailwindcss'
Error: Error resolve node module 'prettier-plugin-tailwindcss'
    at n (c:\Users\phamhongphuc\.vscode\extensions\esbenp.prettier-vscode-10.4.0\dist\extension.js:1:2718)
    at c:\Users\phamhongphuc\.vscode\extensions\esbenp.prettier-vscode-10.4.0\dist\extension.js:1:3068
    at Array.map (<anonymous>)
    at t.resolveConfigPlugins (c:\Users\phamhongphuc\.vscode\extensions\esbenp.prettier-vscode-10.4.0\dist\extension.js:1:3003)
    at t.ModuleResolver.resolveConfig (c:\Users\phamhongphuc\.vscode\extensions\esbenp.prettier-vscode-10.4.0\dist\extension.js:1:7485)
    at t.default.getSelectors (c:\Users\phamhongphuc\.vscode\extensions\esbenp.prettier-vscode-10.4.0\dist\extension.js:1:11766)
    at t.default.handleActiveTextEditorChanged (c:\Users\phamhongphuc\.vscode\extensions\esbenp.prettier-vscode-10.4.0\dist\extension.js:1:11120)
```

### Log - Cannot find package 'prettier' imported from

```log
["DEBUG" - 11:43:54 AM] Local prettier module path: d:\Code\issue\prettier-yarn-issue\.yarn\sdks\prettier\index.cjs
["INFO" - 11:43:54 AM] Using config file at d:\Code\issue\prettier-yarn-issue\.prettierrc.cjs
["ERROR" - 11:43:54 AM] Error handling text editor change
["ERROR" - 11:43:54 AM] Cannot find package 'prettier' imported from d:\Code\issue\prettier-yarn-issue\.yarn\__virtual__\prettier-plugin-tailwindcss-virtual-8449e33aeb\0\cache\prettier-plugin-tailwindcss-npm-0.5.14-4c72a3a392-10.zip\node_modules\prettier-plugin-tailwindcss\dist\index.mjs
Did you mean to import prettier-yarn-issue/.yarn/unplugged/prettier-npm-3.2.5-6859110d6a/node_modules/prettier/plugins/angular.js?
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'prettier' imported from d:\Code\issue\prettier-yarn-issue\.yarn\__virtual__\prettier-plugin-tailwindcss-virtual-8449e33aeb\0\cache\prettier-plugin-tailwindcss-npm-0.5.14-4c72a3a392-10.zip\node_modules\prettier-plugin-tailwindcss\dist\index.mjs
Did you mean to import prettier-yarn-issue/.yarn/unplugged/prettier-npm-3.2.5-6859110d6a/node_modules/prettier/plugins/angular.js?
    at new NodeError (node:internal/errors:405:5)
    at packageResolve (node:internal/modules/esm/resolve:863:9)
    at moduleResolve (node:internal/modules/esm/resolve:912:20)
    at defaultResolve (node:internal/modules/esm/resolve:1105:11)
    at nextResolve (node:internal/modules/esm/loader:166:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:840:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:429:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
    at link (node:internal/modules/esm/module_job:76:36)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
```
