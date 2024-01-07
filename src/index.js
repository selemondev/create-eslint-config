import * as editorConfigs from '../templates/editorConfig.js'

import stringifyJS from '../utils/stringifyJS.js'
import { deepMerge } from '../utils/deepMerge.js'

import versionMap from '../versionMap.cjs'

// This is also used in `create-react-next`
export default function createConfig({
  styleGuide = 'default', // default | airbnb | typescript | standard
  hasTypeScript = false, // js | ts
  additionalConfig = {}, // e.g. Cypress, createAliasSetting for Airbnb, etc.
  additionalDependencies = {}, // e.g. eslint-plugin-cypress
} = {}) {
  // This is the pkg object to extend
  const pkg = { devDependencies: {} }
  const addDependency = (name) => {
    pkg.devDependencies[name] = versionMap[name]
  }
  addDependency('eslint')

  if (styleGuide !== 'default' || hasTypeScript)
    addDependency('@rushstack/eslint-patch')

  const language = hasTypeScript ? 'typescript' : 'javascript'
  const eslintConfig = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
  const addDependencyAndExtend = (name) => {
    addDependency(name)
    eslintConfig.extends.push(name)
  }

  switch (`${styleGuide}-${language}`) {
    case 'default-javascript':
      eslintConfig.extends.push('eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended')
      addDependency('eslint-plugin-react')
      addDependency('eslint-plugin-react-hooks')
      addDependency('eslint-plugin-react-refresh')
      break
    case 'default-typescript':
      eslintConfig.extends.push('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended')
      addDependency('@typescript-eslint/parser')
      addDependency('eslint-plugin-react-hooks')
      addDependency('eslint-plugin-react-refresh')
      // TODO: Update this
      addDependency('@typescript-eslint/eslint-plugin')
      break
    case 'airbnb-javascript':
      eslintConfig.extends.push('airbnb', 'airbnb/hooks')
      addDependency('eslint-config-airbnb', 'eslint-plugin-import', 'eslint-plugin-jsx-a11y', 'eslint-plugin-react', 'eslint-plugin-react-hooks')
      break
    case 'standard-javascript':
      addDependencyAndExtend(`eslint-config-${styleGuide}-react`)
      addDependencyAndExtend('eslint-config-standard')
      addDependencyAndExtend('eslint-config-standard-jsx')
      addDependency('@babel/eslint-parser')
      addDependency('@babel/core')
      break
    case 'standard-typescript':
      addDependencyAndExtend(`eslint-config-standard-with-typescript`)
      addDependency('@typescript-eslint/parser')
      addDependency('@typescript-eslint/eslint-plugin')
      addDependency('eslint-plugin-promise')
      addDependency('@typescript-eslint/eslint-plugin')
      addDependency('eslint-plugin-n')
      break
    case 'airbnb-typescript':
      addDependencyAndExtend(`eslint-config-${styleGuide}-typescript`)
      addDependency('@typescript-eslint/parser')
      addDependency('@typescript-eslint/eslint-plugin')
      break
    default:
      throw new Error(`Unexpected combination of styleGuide and language: ${styleGuide}-${language}`)
  }
  deepMerge(pkg.devDependencies, additionalDependencies)
  deepMerge(eslintConfig, additionalConfig)
  const files = {
    '.eslintrc.cjs': '',
  }
  //     if (styleGuide === 'default' && !hasTypeScript) {
  //         // Both Airbnb & Standard have already set `env: node`
  //         files['.eslintrc.cjs'] += '/* eslint-env node */\n'
  //         // Both Airbnb & Standard have already set `ecmaVersion`
  //         eslintConfig.parserOptions = {
  //             ecmaVersion: 'latest',
  //             sourceType: 'module',
  //         },
  //   } else if (styleGuide === 'standard' && !hasTypeScript) {
  //         eslintConfig.parser = '@babel/eslint-parser'
  //     } else if (hasTypeScript) {
  //         eslintConfig.parser = '@typescript-eslint/parser'
  //     }

  if (styleGuide === 'default' && !hasTypeScript) {
    // Both Airbnb & Standard have already set `env: node`
    files['.eslintrc.cjs'] += '/* eslint-env node */\n'
    // Both Airbnb & Standard have already set `ecmaVersion`
    eslintConfig.parserOptions = {
      ecmaVersion: 'latest',
      sourceType: 'module',
    }
  }
  else if (styleGuide === 'standard' && !hasTypeScript) {
    eslintConfig.parser = '@babel/eslint-parser'
  }
  else if (hasTypeScript) {
    eslintConfig.parser = '@typescript-eslint/parser'
  }

  if (pkg.devDependencies['@rushstack/eslint-patch'])
    files['.eslintrc.cjs'] += 'require(\'@rushstack/eslint-patch/modern-module-resolution\')\n\n'
  files['.eslintrc.cjs'] += `module.exports = ${stringifyJS(eslintConfig, styleGuide)}\n`
  // .editorconfig
  // TODO: Fix type error
  if (editorConfigs[styleGuide])
    files['.editorconfig'] = editorConfigs[styleGuide]
  return {
    pkg,
    files,
  }
}
