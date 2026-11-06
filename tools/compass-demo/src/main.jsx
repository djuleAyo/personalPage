import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Compass from '@compass-source';
import { createCompassFixture, createExpandedCompassFixture } from '@compass-fixtures';
import './showcase.css';

const surfaceForViewport = () => window.innerWidth <= 560
  ? { cardWidth: 100, cardHeight: 28, radius: 90, maxRows: 2, maxSiblings: 3 }
  : { cardWidth: 112, cardHeight: 30, radius: 104, maxRows: 3, maxSiblings: 5 };

const makeModel = (preset = 'expanded', layout = 'focus') => ({
  ...(preset === 'small' ? createCompassFixture() : createExpandedCompassFixture()),
  presentation: { layout, surface: surfaceForViewport() }
});

function Showcase() {
  const api = useRef(null);
  const [preset, setPreset] = useState('expanded');
  const [model, setModel] = useState(() => makeModel());
  const [selection, setSelection] = useState(null);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 560px)');
    const updatePresentation = () => setModel(current => ({ ...current, presentation: { ...current.presentation, surface: surfaceForViewport() } }));
    query.addEventListener('change', updatePresentation);
    return () => query.removeEventListener('change', updatePresentation);
  }, []);
  const layout = model.presentation.layout;
  const setLayout = next => setModel(current => ({ ...current, presentation: { ...current.presentation, layout: next } }));
  const changePreset = next => { api.current?.cancel(); setPreset(next); setModel(makeModel(next, layout)); setSelection(null); };
  const reset = () => { api.current?.cancel(); setModel(makeModel(preset, layout)); setSelection(null); };
  const focus = focusId => { setModel(current => ({ ...current, focusId })); setSelection(null); };
  const countEdges = model.relations.reduce((sum, relation) => sum + relation.edges.length, 0);
  return <main className="compass-showcase">
    <header className="showcase-toolbar">
      <div className="showcase-heading"><strong>Compass</strong><span>Sample semantic graph</span></div>
      <div className="showcase-controls">
        <div className="layout-switch" role="group" aria-label="Graph presentation">
          <button type="button" aria-pressed={layout === 'focus'} onClick={() => setLayout('focus')}>Focus surface</button>
          <button type="button" aria-pressed={layout === 'radial'} onClick={() => setLayout('radial')}>Radial sectors</button>
        </div>
        <label className="showcase-dataset"><span>Graph</span><select value={preset} onChange={event => changePreset(event.target.value)} aria-label="Sample graph"><option value="expanded">Expanded</option><option value="small">Small</option></select></label>
        <button className="showcase-reset" type="button" onClick={reset}>Reset</button>
      </div>
    </header>
    <div className="showcase-meta"><span>{model.nodes.length} nodes · {countEdges} edges · 3 relations / 6 directions</span><a href={preset === 'expanded' ? './expanded-graph.json' : './small-graph.json'} download>Graph JSON ↓</a></div>
    <div className="showcase-stage">
      <Compass ref={api} model={model} onSelect={setSelection} onFocusChange={focus}
        stepDistance={{ x: 64, y: 64 }} innerRadius={128} interRingDistance={74} nodeGap={104} itemDiameter={100}
        fling={{ enabled: true, x: { deceleration: 1200 }, y: { deceleration: 1200 } }} />
    </div>
    <footer className="showcase-selection" aria-live="polite">
      {selection ? <><strong>{selection.node.label}</strong><span>id: {selection.node.id} · {model.partitions.find(partition => partition.id === selection.partitionId)?.label}</span></> : <><strong>Explore a relation, then focus a node.</strong><span>Switching the renderer keeps the current graph and navigation.</span></>}
    </footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<Showcase />);
