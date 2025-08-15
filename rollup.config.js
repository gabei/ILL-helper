import json from '@rollup/plugin-json'

export default {
    input: 'content_scripts/lender-search.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs'
    },
    plugins: [json()]
}