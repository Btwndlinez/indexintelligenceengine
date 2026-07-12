'use client';

const pipelineStages = [
  { title: 'Detected', color: '#8B95A5', items: [
    { name: '901 Birch Ln', value: '$32K', score: 74 },
    { name: '246 Walnut Ave', value: '$55K', score: 68 },
    { name: '1122 Cherry St', value: '$28K', score: 62 },
  ]},
  { title: 'Validated', color: '#2E86AB', items: [
    { name: '890 Pine Ave', value: '$340K', score: 88 },
    { name: '135 Cedar Rd', value: '$89K', score: 71 },
  ]},
  { title: 'Scored', color: '#E8EDF2', items: [
    { name: '1243 Oak St', value: '$120K', score: 92 },
    { name: '567 Elm Dr', value: '$65K', score: 85 },
  ]},
  { title: 'Contacted', color: '#36C9C6', items: [
    { name: '234 Maple Ct', value: '$48K', score: 79 },
  ]},
  { title: 'Won', color: '#22C55E', items: [
    { name: '789 Spruce Way', value: '$210K', score: 95 },
  ]},
];

export default function PipelinePage() {
  return (
    <div style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Pipeline</h1>
        <div style={{ fontSize: 13, color: '#8B95A5' }}>Total: <strong style={{ color: '#E8EDF2' }}>$987K</strong></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pipelineStages.length}, 1fr)`, gap: 12, flex: 1 }}>
        {pipelineStages.map(stage => (
          <div key={stage.title} style={{ background: '#0E121A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: stage.color, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${stage.color}` }}>{stage.title} ({stage.items.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stage.items.map(item => (
                <div key={item.name} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8B95A5' }}>
                    <span>{item.value}</span>
                    <span style={{ color: '#2E86AB', fontWeight: 700 }}>{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
