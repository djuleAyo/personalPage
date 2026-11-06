Compass portfolio embed

This demo bundles the actual @tmr/rcl Compass component and its exported sample fixtures.
It does not connect to Worker Studio, a model provider, a browser driver, or a live Molecule graph.

Build from a monorepo checkout with dependencies installed:
  TMR_SOURCE_ROOT=/absolute/path/to/TMR node build.mjs

If source and installed dependencies live in different checkouts:
  TMR_SOURCE_ROOT=/absolute/path/to/TMR \
  TMR_DEPENDENCY_ROOT=/absolute/path/to/dependency-checkout node build.mjs

The build reads rcl/src/Compass/Compass.tsx and fixtures.ts, resolves React and esbuild
from the dependency checkout, and writes dist/. Serve the whole dist/ directory as
/demos/compass/; use index.html as the iframe URL. Include compass.js.LEGAL.txt.

Recommended iframe height: 820px. The component fills its available viewport.
The controls and graph remain usable on narrow screens; graph layout is viewport-bounded.
The graph is illustrative fixture data: expanded 121 nodes / 213 edges, small 16 nodes.

Checked in the browser:
- Actual focus-surface render with visible relation partitions.
- Relation navigation, then changing to radial layout preserves selection/status.
- Focus selected recenters on the chosen node.
- Narrow layout does not overflow the document.
- No JavaScript exceptions.

Sources: src/main.jsx (portfolio wrapper only), src/showcase.css, build.mjs.
The Compass implementation is imported from the supplied monorepo source; it is not duplicated here.
Generated JSON downloads are the original exported fixture models.

provenance.json records the checkout HEAD (when available), React/esbuild versions,
and SHA-256 hashes for the 20 imported TMR source files. Those hashes identify
the exact working-tree source, independently of the checkout HEAD.
TMR_SOURCE_COMMIT can supply a known checkout HEAD when subprocess git is unavailable.

Set COMPASS_OUTPUT_DIR to override dist/, for example:
  TMR_SOURCE_ROOT=/path/to/TMR \
  COMPASS_OUTPUT_DIR=/path/to/personalPage/static/demos/compass node build.mjs
