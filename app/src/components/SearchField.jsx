import { IconSearch } from './icons';

// The `.input-row` + IconSearch + <input> shell was copy-pasted across
// every search box in the app (Cari Ayat, Cari Global, Cari Masjid) with
// no clear (×) button once you'd actually typed something — you had to
// select-all + delete by hand. One shared field, with that button built
// in this time.
export default function SearchField({ value, onChange, placeholder, autoFocus, onBlur, onKeyDown, inputRef, style }) {
  return (
    <div className="input-row" style={{ borderRadius: 999, ...style }}>
      <IconSearch style={{ color: 'var(--muted)', flexShrink: 0 }} />
      <input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--muted-soft)', flexShrink: 0, display: 'flex' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M18 6 6 18" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
