"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/image";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalorieGoalModal } from "@/components/dashboard/CalorieGoalModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  // Busca os dados do usuário no Firestore ao carregar a página
  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setDailyGoal(docSnap.data().dailyGoal || 0);
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    }

    fetchUserData();
  }, [user]);

  if (authLoading || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-white rounded-full shadow-lg dark:bg-white/10">
            <Image
              src="/img/Logotipo-claro-removebg-preview.png"
              alt="NutriTrack Logo"
              width={220}
              height={110}
              priority
              className="object-contain"
            />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Seu corpo, <span className="text-primary">seu controle</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Monitore sua ingestão calórica e acompanhe seus períodos de jejum intermitente com facilidade e precisão.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4">
          <a 
            href="/register" 
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto text-md shadow-lg shadow-primary/25 text-center")}
          >
            Começar Agora
          </a>
          <a 
            href="/login" 
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-md bg-white/50 backdrop-blur-sm text-center")}
          >
            Já tenho uma conta
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
          <p className="text-muted-foreground">Bem-vindo de volta ao seu controle nutricional.</p>
        </div>
        
        {/* Nosso Modal de Meta sendo usado aqui! */}
        <CalorieGoalModal currentGoal={dailyGoal} onGoalUpdate={setDailyGoal} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meta Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {dailyGoal > 0 ? `${dailyGoal} kcal` : "Não definida"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dailyGoal > 0 ? "Objetivo ativo" : "Clique em 'Definir Meta' acima"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consumido Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0 kcal</div>
            <p className="text-xs text-muted-foreground mt-1">0% da sua meta</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 rounded-xl border border-dashed bg-slate-50/50 dark:bg-zinc-950/50 text-center">
        <h3 className="font-semibold text-lg">Próximos Passos</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
          Agora que você já pode definir sua meta, o próximo passo será o registro das suas refeições diárias!
        </p>
      </div>
    </div>
  );
}
