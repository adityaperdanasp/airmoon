import { useCallback, useEffect, useState } from 'react';
import { getLocation } from './prayerApi';
import { qiblaBearing, distanceToKaaba } from './qibla';

// Device compass heading needs a live event listener (not a one-shot read
// like geolocation), and iOS 13+ gates it behind an explicit user gesture
// (DeviceOrientationEvent.requestPermission()) — Android/desktop browsers
// have no such gate and just start firing events once you're listening.
export function useQibla() {
  const [locStatus, setLocStatus] = useState('loading'); // loading | denied | error | ready
  const [qibla, setQibla] = useState(null); // { bearing, distanceKm }
  const [heading, setHeading] = useState(null);
  const [headingStatus, setHeadingStatus] = useState('idle'); // idle | needs-permission | granted | denied | unsupported

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { lat, lng } = await getLocation();
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
  }, []);

  const handleOrientation = useCallback((e) => {
    if (typeof e.webkitCompassHeading === 'number') {
      setHeading(e.webkitCompassHeading);
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

  return { locStatus, qibla, heading, headingStatus, requestHeadingPermission };
}
