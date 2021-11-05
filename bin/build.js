#!/bin/env/node
const esbuild = require('esbuild')

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/index.umd.js',
    bundle: true,
    minify: true,
    platform: 'browser',
    sourcemap: true,
    target: 'es2015',
    plugins: [nodeExternalsPlugin()]
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node14',
    plugins: [nodeExternalsPlugin()]
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
