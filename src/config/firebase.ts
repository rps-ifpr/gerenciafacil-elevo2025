import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Verifica conexão e mostra status no console
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase inicializado com sucesso');
  console.log('📦 Banco de dados conectado:', db.app.options.projectId);
}

// Função para verificar conexão
export const checkFirestoreConnection = async () => {
  try {
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Conexão com Firestore estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com Firestore:', error);
    return false;
  }
};

export { db };