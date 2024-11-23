import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ADMIN_EMAIL = 'gustavo.seg23@gmail.com';
const ADMIN_PASSWORD = 'Ch@py212223';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Intentar iniciar sesión como administrador primero
        const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          // Si el usuario no existe en Firestore, créalo
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: ADMIN_EMAIL,
            role: 'admin'
          });
        }
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Si el usuario no existe, créalo
          try {
            const newUserCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
            await setDoc(doc(db, 'users', newUserCredential.user.uid), {
              email: ADMIN_EMAIL,
              role: 'admin'
            });
          } catch (createError: any) {
            console.error('Error creating admin:', createError);
          }
        }
      }
    };

    initializeAdmin();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser({ id: user.uid, ...docSnap.data() } as User);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error('Usuario no encontrado en la base de datos');
      }

      const userData = userDoc.data();
      if (userData.role === 'pending') {
        await signOut(auth);
        throw new Error('Su cuenta está pendiente de aprobación');
      }

      setCurrentUser({ id: result.user.uid, ...userData } as User);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('Usuario no encontrado');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Contraseña incorrecta');
      } else if (error.message === 'Su cuenta está pendiente de aprobación') {
        toast.error(error.message);
      } else {
        toast.error('Error al iniciar sesión. Verifique sus credenciales.');
      }
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role: email === ADMIN_EMAIL ? 'admin' : 'pending'
      });
      toast.success('Registro exitoso. Espere la aprobación del administrador.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('El correo electrónico ya está registrado');
      } else {
        toast.error('Error al registrar usuario');
      }
      throw error;
    }
  };

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};