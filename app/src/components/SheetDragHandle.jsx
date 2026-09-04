// Purely visual affordance — signals "this can be dragged down" the same
// way iOS/Android native sheets do, paired with lib/useSwipeDismiss.js's
// actual gesture handling on the sheet's own panel.
export default function SheetDragHandle() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6 }}>
      <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)' }} />
    </div>
  );
}
