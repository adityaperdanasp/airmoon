import { useCallback, useEffect, useState } from 'react';
import { getLocation } from './prayerApi';
import { qiblaBearing, distanceToKaaba } from './qibla';

const OVERRIDE_KEY = 'airmoon-qibla-override-location';

function loadOverride() {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Device compass heading needs a live event listener (not a one-shot read
// like geolocation), and iOS 13+ gates it behind an explicit user gesture
// (DeviceOrientationEvent.requestPermission()) — Android/desktop browsers
// have no such gate and just start firing events once you're listening.
export function useQibla() {
  const [locStatus, setLocStatus] = useState('loading'); // loading | denied | error | ready
  const [qibla, setQibla] = useState(null); // { bearing, distanceKm }
  const [heading, setHeading] = useState(null);
  const [headingAccuracy, setHeadingAccuracy] = useState(null); // degrees, iOS-only (webkitCompassAccuracy)
  const [headingStatus, setHeadingStatus] = useState('idle'); // idle | needs-permission | granted | denied | unsupported
  // null while unset = "use GPS"; { lat, lng, label } once the user picks
  // somewhere manually via "Ganti Lokasi" — persisted so it survives
  // leaving and coming back to this page, same as this app's other
  // localStorage-backed preferences (theme, language, night mode).
  const [override, setOverrideState] = useState(loadOverride);

  useEffect(() => {
    let cancelled = false;
    setLocStatus('loading');
    (async () => {
      try {
        const { lat, lng } = override || (await getLocation());
        if (cancelled) return;
        setQibla({ bearing: qiblaBearing(lat, lng), distanceKm: distanceToKaaba(lat, lng) });
        setLocStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setLocStatus(err.code === 1 ? 'denied' : 'error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [override]);

  const setOverride = useCallback((loc) => {
    setOverrideState(loc);
    try {
      if (loc) localStorage.setItem(OVERRIDE_KEY, JSON.stringify(loc));
      else localStorage.removeItem(OVERRIDE_KEY);
    } catch {
      // Storage full/blocked — the in-memory state above still works for
      // this session, it just won't survive a reload.
    }
  }, []);

  const handleOrientation = useCallback((e) => {
    if (typeof e.webkitCompassHeading === 'number') {
      setHeading(e.webkitCompassHeading);
      if (typeof e.webkitCompassAccuracy === 'number' && e.webkitCompassAccuracy >= 0) {
        setHeadingAccuracy(e.webkitCompassAccuracy);
      }
    } else if (e.alpha != null) {
      setHeading((360 - e.alpha) % 360);
    }
  }, []);

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setHeadingStatus('unsupported');
      return;
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      setHeadingStatus('needs-permission');
      return;
    }
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
    setHeadingStatus('granted');
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  const requestHeadingPermission = useCallback(async () => {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setHeadingStatus('granted');
      } else {
        setHeadingStatus('denied');
      }
    } catch {
      setHeadingStatus('denied');
    }
  }, [handleOrientation]);

  return {
    locStatus,
    qibla,
    heading,
    headingAccuracy,
    headingStatus,
    requestHeadingPermission,
    override,
    setOverride,
  };
}
