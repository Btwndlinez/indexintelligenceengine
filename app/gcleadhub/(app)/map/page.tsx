'use client';

import { useState } from 'react';

const layers = ['Opportunities', 'Properties', 'Permits', 'Inspections', 'Tax Delinquencies', 'Code Violations', 'Fire Incidents', 'Flood Zones', 'Crime', 'Utility Infrastructure', 'Competitor Activity', 'Customer Locations'];

export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState(['Opportunities', 'Properties']);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]);
  };

  return (
    <div style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Map Explorer</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Radius', 'Polygon', 'Drive Time'].map(t => (
            <button key={t} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, background: '#0E121A', color: '#8B95A5', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0 }}>
        <div style={{ width: 200, background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A6577', marginBottom: 8 }}>Layers</div>
          {layers.map(l => (
            <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', fontSize: 13, color: activeLayers.includes(l) ? '#E8EDF2' : '#8B95A5', cursor: 'pointer' }}>
              <input type="checkbox" checked={activeLayers.includes(l)} onChange={() => toggleLayer(l)} style={{ accentColor: '#2E86AB' }} />
              {l}
            </label>
          ))}
        </div>
        <div style={{ flex: 1, background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#5A6577' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px' }}><path d="M14 2v6a2 2 0 0 0 2 2h6"/><path d="M4 22V8l6-4 6 4 6-4v14l-6 4-6-4-6 4Z"/><path d="M10 18V2"/><path d="M14 10v12"/></svg>
            <p style={{ fontSize: 14, marginBottom: 4 }}>Map View</p>
            <p style={{ fontSize: 12 }}>Interactive GIS map will render here with {activeLayers.length} active layers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
