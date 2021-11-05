const esbuild = require('esbuild');

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/index.umd.js',
    bundle: true,
    minify: true,
    format: 'esm',
    sourcemap: true,
    target: 'esnext',
    plugins: [nodeExternalsPlugin()]
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

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
    console.error(err);
    process.exit(1);
  });
