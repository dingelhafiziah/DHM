import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth, firestore, isFirebaseConfigured } from './firebase';
import type { User } from '../types';

export async function signInWithFirebaseCredentials(
  email: string,
  password: string
): Promise<User> {
  if (!isFirebaseConfigured || !firebaseAuth || !firestore) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* environment values first.');
  }

  const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  const profileRef = doc(firestore, 'users', credential.user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    await signOut(firebaseAuth);
    throw new Error('Your Firebase account has no authorized user profile. Ask the Admin to create/approve your profile.');
  }

  const data = profileSnap.data();
  const role = data.role;

  if (role !== 'admin' && role !== 'teacher') {
    await signOut(firebaseAuth);
    throw new Error('This account does not have an allowed Admin or Teacher role.');
  }

  return {
    id: credential.user.uid,
    name: String(data.name ?? credential.user.displayName ?? credential.user.email ?? 'User'),
    banglaName: data.banglaName,
    email: credential.user.email ?? email.trim(),
    role,
    phone: data.phone,
    designation: String(data.designation ?? (role === 'admin' ? 'Admin' : 'Teacher')),
    avatar: data.avatar,
  };
}

export async function signOutFromFirebase(): Promise<void> {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  }
}
