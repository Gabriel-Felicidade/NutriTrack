import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Carregar variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Erro: Arquivo .env.local não encontrado!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// 2. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. Pegar credenciais dos argumentos do terminal
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("\nUso: node seed-meals.mjs <seu-email> <sua-senha>\n");
  process.exit(1);
}

async function run() {
  try {
    console.log(`Fazendo login como ${email}...`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    console.log(`Login realizado com sucesso! UID: ${userId}\n`);

    const mealsRef = collection(db, "users", userId, "meals");

    // Lista de refeições para semear nos últimos dias
    const mockMeals = [
      {
        description: "Jantar Saudável",
        calories: 620,
        type: "Jantar",
        date: "2026-05-24", // Ontem
        timestamp: new Date("2026-05-24T20:30:00")
      },
      {
        description: "Salada com Frango Grelhado",
        calories: 480,
        type: "Almoço",
        date: "2026-05-24", // Ontem
        timestamp: new Date("2026-05-24T12:45:00")
      },
      {
        description: "Iogurte Natural com Granola",
        calories: 280,
        type: "Café da Manhã",
        date: "2026-05-24", // Ontem
        timestamp: new Date("2026-05-24T08:00:00")
      },
      {
        description: "Sopa de Legumes",
        calories: 350,
        type: "Jantar",
        date: "2026-05-23", // Anteontem
        timestamp: new Date("2026-05-23T20:00:00")
      },
      {
        description: "Arroz, Feijão e Bife",
        calories: 750,
        type: "Almoço",
        date: "2026-05-23", // Anteontem
        timestamp: new Date("2026-05-23T13:00:00")
      },
      {
        description: "Tapioca com Queijo Coalho",
        calories: 380,
        type: "Café da Manhã",
        date: "2026-05-23", // Anteontem
        timestamp: new Date("2026-05-23T07:45:00")
      },
      {
        description: "Macarrão Integral com Molho de Tomate",
        calories: 680,
        type: "Jantar",
        date: "2026-05-22", // 3 dias atrás
        timestamp: new Date("2026-05-22T19:30:00")
      },
      {
        description: "Lasanha de Berinjela",
        calories: 520,
        type: "Almoço",
        date: "2026-05-22", // 3 dias atrás
        timestamp: new Date("2026-05-22T12:30:00")
      }
    ];

    console.log("Enviando refeições históricas para o Firestore...");
    for (const meal of mockMeals) {
      await addDoc(mealsRef, meal);
      console.log(`- Adicionado: ${meal.description} (${meal.date})`);
    }

    console.log("\nSemeação concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("\nErro durante o processo:", error.message);
    process.exit(1);
  }
}

run();
