import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const sourceRoot = process.env.TMR_SOURCE_ROOT;
if (!sourceRoot) throw new Error('Set TMR_SOURCE_ROOT to the monorepo checkout containing rcl/src/Compass.');
const dependencyRoot = process.env.TMR_DEPENDENCY_ROOT || sourceRoot;
const dependencyRequire = createRequire(join(resolve(dependencyRoot), 'rcl/package.json'));
const esbuildRequire = createRequire(dependencyRequire.resolve('vite/package.json'));
const esbuild = esbuildRequire('esbuild');
const dist = process.env.COMPASS_OUTPUT_DIR ? resolve(process.env.COMPASS_OUTPUT_DIR) : join(here, 'dist');
await mkdir(dist, { recursive: true });
const source = name => join(resolve(sourceRoot), 'rcl/src/Compass', name);
const bundle = await esbuild.build({
  metafile: true, entryPoints: [join(here, 'src/main.jsx')], outfile: join(dist, 'compass.js'), bundle: true,
  minify: true, sourcemap: false, format: 'esm', target: ['es2022'], jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'external',
  alias: {
    '@compass-source': source('Compass.tsx'), '@compass-fixtures': source('fixtures.ts'),
    '@tmr/tree/read': join(resolve(sourceRoot), 'tree/read.mjs'),
    react: dirname(dependencyRequire.resolve('react/package.json')),
    'react-dom': dirname(dependencyRequire.resolve('react-dom/package.json'))
  }
});
let commit = process.env.TMR_SOURCE_COMMIT || null;
try { if (!commit) commit = execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {}
const sourceFiles = {};
for (const name of Object.keys(bundle.metafile.inputs)) {
  const absolute = resolve(name);
  const path = relative(resolve(sourceRoot), absolute);
  if (!path.startsWith('..') && !path.includes('node_modules')) {
    sourceFiles[path] = createHash('sha256').update(await readFile(absolute)).digest('hex');
  }
}
await writeFile(join(dist, 'provenance.json'), JSON.stringify({
  component: 'TMR / rcl/src/Compass', commit,
  sourceHashes: sourceFiles,
  fixture: 'createExpandedCompassFixture and createCompassFixture',
  react: dependencyRequire('react/package.json').version, esbuild: esbuild.version,
  note: 'Built from local source; hashes identify exact inputs independently of commit.'
}, null, 2) + '\n');
const fixtureBuild = await esbuild.build({ entryPoints: [source('fixtures.ts')], bundle: true, write: false, format: 'cjs', platform: 'node' });
const fixtureModule = { exports: {} };
vm.runInNewContext(fixtureBuild.outputFiles[0].text, { module: fixtureModule, exports: fixtureModule.exports });
for (const [name, create] of [['expanded', fixtureModule.exports.createExpandedCompassFixture], ['small', fixtureModule.exports.createCompassFixture]]) {
  await writeFile(join(dist, `${name}-graph.json`), JSON.stringify(create(), null, 2) + '\n');
}
await writeFile(join(dist, 'index.html'), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Compass — semantic graph navigation</title><link rel="icon" href="data:,"><meta name="description" content="Interactive sample graph rendered by the actual TMR Compass component."><link rel="stylesheet" href="./compass.css"></head><body><div id="root"></div><noscript><p>Enable JavaScript to explore the sample graph in Compass. The graph data is available as <a href="./expanded-graph.json">JSON</a>.</p></noscript><script type="module" src="./compass.js"></script></body></html>\n`);
const stats = await Promise.all(['compass.js', 'compass.css', 'expanded-graph.json', 'small-graph.json'].map(async name => [name, (await readFile(join(dist, name))).length]));
console.log(JSON.stringify({ sourceRoot: resolve(sourceRoot), dependencyRoot: resolve(dependencyRoot), dist, bytes: Object.fromEntries(stats) }, null, 2));
