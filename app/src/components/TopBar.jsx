import { useNavigate } from 'react-router-dom';
import { IconBack } from './icons';

export default function TopBar({ title, subtitle, right }) {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Kembali">
        <IconBack />
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="title">{title}</span>
        {subtitle && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{subtitle}</span>}
      </div>
      {right || <div className="icon-btn" style={{ visibility: 'hidden' }} />}
    </div>
  );
}
