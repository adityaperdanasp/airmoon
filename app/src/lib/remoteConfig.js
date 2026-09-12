import { getRemoteConfig, fetchAndActivate, getValue, getBoolean } from 'firebase/remote-config';
import { app } from './firebase';

// Firebase Remote Config (2026-09-12) — this app has no A/B-testing or
// feature-flagging infrastructure at all; every one of ~150 features
// shipped went straight to 100% of users with no way to toggle or tune
// anything without a full redeploy. Remote Config is the cheapest real
// step toward that — it's already Firebase (same project, no new
// account), and any of the parameters below can be changed live from
// Firebase Console → Remote Config, no code change or redeploy needed.
// The values here are just the DEFAULTS (used until a real fetch
// succeeds, or if Remote Config is never actually configured in the
// console at all) — the actual experiment values are the founder's to
// set later; this file is the shovel-ready client-side half.
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour — this app has no need for near-live config changes
remoteConfig.defaultConfig = {
  supporter_cross_sell_enabled: true,
  nps_prompt_enabled: true,
  home_headline_variant: 'default',
};

let readyPromise = null;
export function initRemoteConfig() {
  if (!readyPromise) {
    readyPromise = fetchAndActivate(remoteConfig).catch(() => {
      // Offline, or Remote Config never set up in the console — the
      // defaultConfig above is already active either way, nothing to do.
    });
  }
  return readyPromise;
}

export function isSupporterCrossSellEnabled() {
  return getBoolean(remoteConfig, 'supporter_cross_sell_enabled');
}

export function isNpsPromptEnabled() {
  return getBoolean(remoteConfig, 'nps_prompt_enabled');
}

export function getHomeHeadlineVariant() {
  return getValue(remoteConfig, 'home_headline_variant').asString();
}
