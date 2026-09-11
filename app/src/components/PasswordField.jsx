import { useState } from 'react';

// Shared password `.input-row` with a show/hide toggle — Login.jsx and
// SignUp.jsx both had a bare `type="password"` field with no way to see
// what you typed, unlike almost every other app's sign-in form. One
// component so both stay in sync.
export default function PasswordField({ value, onChange, placeholder = '••••••••', autoComplete, ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-row">
      <input
        type={visible ? 'text' : 'password'}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        style={{ background: 'none', border: 'none', color: 'var(--muted-soft)', cursor: 'pointer', padding: 4, display: 'flex', flexShrink: 0 }}
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" strokeWidth="1.7" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3l18 18" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a13.6 13.6 0 0 1-2.9 3.9M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.4-.6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
