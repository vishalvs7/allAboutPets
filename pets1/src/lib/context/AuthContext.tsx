"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";

type UserRole = "customer" | "clinic" | "trainer" | "store" | "admin";

interface AuthUser extends User {
  role?: UserRole;
  displayName?: string;
  providerData?: any; // Clinic/Trainer/Store specific data
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signupAsProvider: (
    email: string, 
    password: string, 
    name: string, 
    role: "clinic" | "trainer" | "store",
    providerData: any
  ) => Promise<void>;
  logout: () => Promise<void>;
  redirectBasedOnRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();
        
        const authUser: AuthUser = {
          ...firebaseUser,
          role: userData?.role || "customer",
          displayName: userData?.name || firebaseUser.displayName || "",
          providerData: userData?.providerData || null
        };
        
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Function to redirect user based on their role
  const redirectBasedOnRole = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    switch (user.role) {
      case "customer":
        router.push("/profile");
        break;
      case "clinic":
        router.push("/clinic/dashboard");
        break;
      case "trainer":
        router.push("/trainer/dashboard");
        break;
      case "store":
        router.push("/store/dashboard");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = "customer") => {
    try {
      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update display name in auth
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Create user document in Firestore with role
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    }
  };

  const signupAsProvider = async (
    email: string, 
    password: string, 
    name: string, 
    role: "clinic" | "trainer" | "store",
    providerData: any
  ) => {
    try {
      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update display name
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Create provider-specific document
      const providerCollection = role === "clinic" ? "clinics" : 
                                role === "trainer" ? "trainers" : "sellers";
      
      await setDoc(doc(db, providerCollection, userCredential.user.uid), {
        ...providerData,
        email,
        name,
        userId: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 4. Create user document with role
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        name,
        role,
        providerId: userCredential.user.uid, // Same as document ID in provider collection
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    } catch (error: any) {
      throw new Error(error.message || "Provider signup failed");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      signupAsProvider,
      logout, 
      redirectBasedOnRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}