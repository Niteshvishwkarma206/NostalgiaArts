import { createContext, useContext, useEffect, useState } from 'react';
import { isFirebaseConfigured, auth, ADMIN_EMAIL } from '../firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

const AuthContext = createContext(null);

const USERS_KEY = 'era_nostalgia_users';
const SESSION_KEY = 'era_nostalgia_session';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureSandboxUsers() {
  const users = readUsers();
  if (users.length === 0) {
    writeUsers([
      {
        uid: 'admin-seed',
        email: ADMIN_EMAIL,
        password: 'Nitesh143',
        displayName: 'Gallery Admin',
        role: 'admin',
      },
      {
        uid: 'customer-seed',
        email: 'user@eranostalgia.com',
        password: 'password123',
        displayName: 'Demo Customer',
        role: 'customer',
      },
    ]);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'customer',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsub;
    } else {
      ensureSandboxUsers();
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    if (isFirebaseConfigured) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      ensureSandboxUsers();
      const users = readUsers();
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) throw new Error('Invalid email or password');
      const sessionUser = {
        uid: found.uid,
        email: found.email,
        displayName: found.displayName,
        role: found.role,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
    }
  }

  async function register(email, password, displayName) {
    if (isFirebaseConfigured) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(cred.user, { displayName });
    } else {
      ensureSandboxUsers();
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        throw new Error('An account with this email already exists');
      }
      const newUser = {
        uid: `user-${Date.now()}`,
        email,
        password,
        displayName: displayName || email.split('@')[0],
        role: email === ADMIN_EMAIL ? 'admin' : 'customer',
      };
      writeUsers([...users, newUser]);
      const sessionUser = { uid: newUser.uid, email, displayName: newUser.displayName, role: newUser.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
    }
  }

  async function logout() {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    }
  }

  async function resetPassword(email) {
    if (isFirebaseConfigured) {
      await sendPasswordResetEmail(auth, email);
    } else {
      ensureSandboxUsers();
      const users = readUsers();
      if (!users.some((u) => u.email === email)) {
        throw new Error('No account found with this email');
      }
      // Sandbox mode has no email transport - simulate success so the flow
      // can be demonstrated end-to-end.
      return true;
    }
  }

  async function updateDisplayName(displayName) {
    if (isFirebaseConfigured) {
      await updateProfile(auth.currentUser, { displayName });
      setUser((u) => ({ ...u, displayName }));
    } else {
      const users = readUsers().map((u) =>
        u.uid === user.uid ? { ...u, displayName } : u
      );
      writeUsers(users);
      const updated = { ...user, displayName };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setUser(updated);
    }
  }

  const isAdmin = user?.role === 'admin' || user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, register, logout, resetPassword, updateDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
