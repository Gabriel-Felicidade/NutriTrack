import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * CONFIGURAÇÃO DO FIREBASE (BACKEND AS A SERVICE)
 * Centralizamos aqui a conexão com os serviços de Nuvem do Google.
 * As chaves são lidas de variáveis de ambiente (.env) para garantir a segurança.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// PADRÃO SINGLETON: Inicializa o Firebase apenas uma vez durante o ciclo de vida do app.
// Isso evita erros de "duplicate app" comuns no desenvolvimento com Next.js (Fast Refresh).
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Exportamos as instâncias prontas para uso em outros componentes:
// auth: Gerenciamento de usuários e sessões
// db: Acesso ao banco de dados NoSQL (Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
