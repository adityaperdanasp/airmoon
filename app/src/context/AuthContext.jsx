import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase';

const AuthContext = createContext(null);

async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || 'Sahabat airmoon',
      email: user.email,
      walletBalance: 0,
      points: 0,
      createdAt: serverTimestamp(),
    });
  }
}

// Right after a popup sign-in the Firestore client can still be holding the
// pre-auth token, so the first read of /users/{uid} comes back
// permission-denied. Retry a couple of times before giving up.
async function ensureUserDocWithRetry(user, attempts = 3) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      await ensureUserDoc(user);
      return;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      // Publish the auth state first — creating the profile document must
      // never gate signing in, or a Firestore hiccup locks the user out.
      setUser(u);
      if (u) {
        ensureUserDocWithRetry(u).catch((err) => {
          console.error('Gagal menyiapkan profil pengguna:', err);
        });
      }
    });
  }, []);

  async function signUpWithEmail(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // The account already exists at this point, so a failure here must not
    // bubble up as "gagal daftar" — onAuthStateChanged retries it anyway.
    try {
      await ensureUserDocWithRetry({ ...cred.user, displayName: name });
    } catch (err) {
      console.error('Gagal menyiapkan profil pengguna:', err);
    }
    return cred.user;
  }

  async function signInWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  }

  async function signInWithFacebook() {
    const cred = await signInWithPopup(auth, facebookProvider);
    return cred.user;
  }

  async function logOut() {
    await signOut(auth);
  }

  // Firebase Auth's updateProfile() mutates auth.currentUser in place but
  // doesn't fire onAuthStateChanged, so nothing here would re-render on
  // its own — spreading currentUser into a new object after the update
  // gives React a new reference to notice, without needing a full
  // sign-out/in or a manual reload().
  async function updateDisplayName(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Nama gak boleh kosong.');
    await updateProfile(auth.currentUser, { displayName: trimmed });
    await setDoc(doc(db, 'users', auth.currentUser.uid), { displayName: trimmed }, { merge: true });
    setUser({ ...auth.currentUser });
  }

  // Deleting an account is a two-step problem: Firebase Auth requires a
  // "recent" sign-in before it'll allow deleteUser() (auth/requires-
  // recent-login otherwise), and the sign-in method determines how that
  // re-auth happens — a password re-entry for email/password accounts,
  // re-triggering the OAuth popup for Google/Facebook (no password to ask
  // for there). Pengaturan.jsx's delete flow calls this with a password
  // only when providerData actually says 'password'.
  //
  // Only the top-level users/{uid} doc is removable from here — Firestore
  // doesn't cascade-delete subcollections, and a client has no way to
  // recursively delete an unbounded number of docs (contributions,
  // favoriteAyat, amalanHarian, ...) safely. Those become permanently
  // orphaned, not a security exposure (firestore.rules still requires
  // request.auth.uid == uid, and that uid can never authenticate again
  // once deleteUser() below succeeds) but not actually erased either —
  // disclosed to the user in Pengaturan.jsx's confirm dialog rather than
  // silently overclaiming "semua data akan dihapus".
  async function deleteAccount(password) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Belum masuk.');
    const providerId = currentUser.providerData[0]?.providerId;

    if (providerId === 'password') {
      if (!password) throw new Error('Masukkan password buat konfirmasi.');
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
    } else if (providerId === 'google.com') {
      await reauthenticateWithPopup(currentUser, googleProvider);
    } else if (providerId === 'facebook.com') {
      await reauthenticateWithPopup(currentUser, facebookProvider);
    }

    try {
      await deleteDoc(doc(db, 'users', currentUser.uid));
    } catch (err) {
      // A failed profile-doc delete shouldn't block the actual account
      // deletion below — the auth account going away is what actually
      // matters for "delete my account".
      console.error('Gagal hapus data profil sebelum hapus akun:', err);
    }

    await deleteUser(currentUser);
  }

  const value = { user, signUpWithEmail, signInWithEmail, signInWithGoogle, signInWithFacebook, logOut, updateDisplayName, deleteAccount };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
