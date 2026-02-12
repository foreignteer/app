'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User, UserRole } from '@/lib/types/user';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
  verifyPasswordResetCode: (oobCode: string) => Promise<string>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: FirebaseUser, forceRefresh = false): Promise<User | null> => {
    try {
      // Get custom claims for role (force refresh to get latest claims if needed)
      const idTokenResult = await firebaseUser.getIdTokenResult(forceRefresh);
      const role = (idTokenResult.claims.role as UserRole) || 'user';

      console.log('User role from token:', role); // Debug log

      // Fetch user document from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName || firebaseUser.displayName || '',
          avatar: userData.avatar || firebaseUser.photoURL || undefined,
          role,
          countryOfOrigin: userData.countryOfOrigin,
          volunteeringExperience: userData.volunteeringExperience,
          jobTitle: userData.jobTitle,
          organization: userData.organization,
          dateOfBirth: userData.dateOfBirth?.toDate(),
          phone: userData.phone,
          emergencyContact: userData.emergencyContact,
          profileCompleted: userData.profileCompleted || false,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        };
      } else {
        // User document doesn't exist yet (might be pending Cloud Function creation)
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || undefined,
          role,
          profileCompleted: false,
          createdAt: new Date(firebaseUser.metadata.creationTime!),
          updatedAt: new Date(),
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setFirebaseUser(firebaseUser);
        setUser(userData);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });

    // Create user document in Firestore
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      email,
      displayName,
      role: 'user',
      profileCompleted: false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    // Send custom verification email via Brevo (from info@foreignteer.com)
    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userCredential.user.uid }),
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }

    return userCredential;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    // Send password reset email with a continue URL that redirects to login after reset
    const actionCodeSettings = {
      // URL to redirect to after password reset is complete
      url: `${window.location.origin}/login?message=password-reset`,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const confirmPasswordResetFn = async (oobCode: string, newPassword: string) => {
    await confirmPasswordReset(auth, oobCode, newPassword);
  };

  const verifyPasswordResetCodeFn = async (oobCode: string): Promise<string> => {
    return await verifyPasswordResetCode(auth, oobCode);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!firebaseUser) throw new Error('No user logged in');

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date(),
    }, { merge: true });

    // Refresh user data
    await refreshUser();
  };

  const refreshUser = async (forceTokenRefresh = false) => {
    if (firebaseUser) {
      // Reload Firebase Auth user to get updated emailVerified status
      await firebaseUser.reload();

      // Update the firebaseUser state with fresh data
      const freshFirebaseUser = auth.currentUser;
      if (freshFirebaseUser) {
        setFirebaseUser(freshFirebaseUser);
        const userData = await fetchUserData(freshFirebaseUser, forceTokenRefresh);
        setUser(userData);
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (!firebaseUser) throw new Error('No user logged in');

    // Send custom verification email via Brevo
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: firebaseUser.uid }),
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        confirmPasswordReset: confirmPasswordResetFn,
        verifyPasswordResetCode: verifyPasswordResetCodeFn,
        updateUserProfile,
        refreshUser,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
