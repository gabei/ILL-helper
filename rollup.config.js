import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: 'content_scripts/lender-search.js',
    output: {
        inlineDynamicImports: true,
        file: 'dist/main.js',
        format: 'cjs'
    },
    plugins: [
        json(),
        nodeResolve()
    ]
}