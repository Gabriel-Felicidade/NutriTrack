"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

/**
 * OTIMIZAÇÃO DE PERFORMANCE:
 * Usamos 'next/dynamic' para carregar os modais e o gráfico apenas quando necessário.
 * Isso diminui o tamanho do pacote inicial e faz a página carregar muito mais rápido.
 */
const CalorieGoalModal = dynamic(() => import("@/components/dashboard/CalorieGoalModal").then(mod => mod.CalorieGoalModal), {
  loading: () => <div className="h-9 w-24 animate-pulse bg-slate-200 rounded-md" />
});

const AddMealModal = dynamic(() => import("@/components/dashboard/AddMealModal").then(mod => mod.AddMealModal), {
  loading: () => <div className="h-9 w-32 animate-pulse bg-slate-200 rounded-md" />
});

const WeeklyProgress = dynamic(() => import("@/components/dashboard/WeeklyProgress").then(mod => mod.WeeklyProgress), {
  ssr: false, // Desabilitamos SSR para gráficos que dependem do 'window' (browser)
  loading: () => <div className="h-[300px] w-full animate-pulse bg-slate-100 rounded-xl" />
});

const EditMealModal = dynamic(() => import("@/components/dashboard/EditMealModal").then(mod => mod.EditMealModal), {
  loading: () => <div className="h-9 w-9 animate-pulse bg-slate-200 rounded-full" />
});

const FastingHistory = dynamic(() => import("@/components/dashboard/FastingHistory").then(mod => mod.FastingHistory), {
  loading: () => <div className="h-[200px] w-full animate-pulse bg-slate-100 rounded-xl" />
});

import { doc, getDoc, collection, query, where, getDocs, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Utensils, Zap } from "lucide-react";
import Image from "next/image";
import { FastingTimer } from "@/components/dashboard/FastingTimer";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { format } from "date-fns";

interface Meal {
  id: string;
  description: string;
  calories: number;
  type: string;
  date: string;
}

/**
 * COMPONENTE DA DASHBOARD
 * Aqui centralizamos a lógica de busca de dados e exibição das métricas.
 */
export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Função memorizada para buscar dados do Firebase
  const fetchUserData = useCallback(async () => {
    if (!user) {
      setLoadingData(false);
      return;
    }
    
    try {
      setLoadingData(true);
      
      // BUSCA DA META: Pegamos a configuração de meta do documento do usuário
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDailyGoal(docSnap.data().dailyGoal || 0);
      }

      // BUSCA DE REFEIÇÕES: Filtramos as refeições apenas pela data de HOJE
      const today = format(new Date(), "yyyy-MM-dd");
      const mealsRef = collection(db, "users", user.uid, "meals");
      
      // Usamos uma Query composta com ordenação por data e hora (timestamp)
      const q = query(mealsRef, where("date", "==", today), orderBy("timestamp", "desc"));
      
      const querySnapshot = await getDocs(q);
      const mealsList: Meal[] = [];
      querySnapshot.forEach((doc) => {
        mealsList.push({ id: doc.id, ...doc.data() } as Meal);
      });
      setMeals(mealsList);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  // Efeito para disparar a busca sempre que o usuário logar ou mudar
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Função para deletar refeição (Operação DELETE do CRUD)
  const handleDeleteMeal = async (mealId: string) => {
    if (!user) return;
    if (!confirm("Tem certeza que deseja excluir esta refeição?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "meals", mealId));
      fetchUserData(); // Atualizamos a UI buscando os dados novamente
    } catch (error) {
      console.error("Erro ao excluir refeição:", error);
    }
  };

  // Cálculos de lógica de negócio realizados no Front-end
  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const progressPercentage = dailyGoal > 0 ? Math.min((totalCalories / dailyGoal) * 100, 100) : 0;

  // Estado de Carregamento (UX)
  if (authLoading || loadingData) {
    return <DashboardSkeleton />;
  }

  // Tela de Boas-vindas para usuários deslogados (Landing Page simples)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-background">
        <div className="flex flex-col items-center space-y-6">
          <div className="mb-4">
            <Image 
              src="/img/Logotipo-claro-removebg-preview.png" 
              alt="Logo" 
              width={350} 
              height={175} 
              priority 
              className="object-contain dark:hidden" 
            />
            <Image 
              src="/img/Logotipo-escuro-removebg-preview.png" 
              alt="Logo" 
              width={350} 
              height={175} 
              priority 
              className="object-contain hidden dark:block" 
            />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Seu corpo, <span className="text-primary">seu controle</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Monitore sua ingestão calórica e acompanhe seus períodos de jejum intermitente.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4">
          <a href="/register" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto text-md shadow-lg shadow-primary/25 text-center")}>Começar Agora</a>
          <a href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-md bg-white/50 backdrop-blur-sm text-center")}>Já tenho uma conta</a>
        </div>
      </div>
    );
  }

  // Renderização da Dashboard para usuários logados
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* CABEÇALHO DO PAINEL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
          <p className="text-muted-foreground text-sm">Resumo do seu dia: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex gap-2">
          {/* Componentes modais importados dinamicamente */}
          <CalorieGoalModal currentGoal={dailyGoal} onGoalUpdate={setDailyGoal} />
          <AddMealModal onMealAdded={fetchUserData} />
        </div>
      </div>
      
      {/* GRID DE MÉTRICAS RÁPIDAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-primary/10 bg-gradient-to-br from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Meta Diária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {dailyGoal > 0 ? `${dailyGoal} kcal` : "---"}
            </div>
            {/* Barra de Progresso Visual */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {progressPercentage.toFixed(0)}% do objetivo consumido
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consumido Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCalories} kcal</div>
            <p className="text-xs text-muted-foreground mt-1">
              Restam {(dailyGoal - totalCalories) > 0 ? dailyGoal - totalCalories : 0} kcal
            </p>
          </CardContent>
        </Card>

        <FastingTimer />
      </div>

      {/* SEÇÃO DE ANÁLISE: Gráfico e Histórico */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WeeklyProgress dailyGoal={dailyGoal} />
        <FastingHistory />
      </div>

      {/* DICA DE SAÚDE (UX/Engagement) */}
      <Card className="shadow-md border-primary/10 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-900/10 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 shrink-0">
            <Zap className="h-8 w-8" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400">Dica de Saúde NutriTrack</h3>
            <p className="text-lg text-amber-900/80 dark:text-amber-200/70 leading-relaxed">
              Manter uma constância na sua meta diária ajuda seu metabolismo a se ajustar melhor aos períodos de jejum. 
              Beber água regularmente durante o jejum também potencializa a desintoxicação do corpo!
            </p>
          </div>
        </div>
      </Card>

      {/* LISTAGEM DE REFEIÇÕES (CRUD - Read) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Utensils className="h-5 w-5" /> Refeições de Hoje
        </h2>
        
        {meals.length === 0 ? (
          <Card className="border-dashed py-12 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">Nenhuma refeição registrada hoje.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Clique em "Adicionar Refeição" para começar.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {meals.map((meal) => (
              <Card key={meal.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{meal.description}</p>
                      <p className="text-xs text-muted-foreground">{meal.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg mr-4">{meal.calories} <span className="text-xs font-normal text-muted-foreground">kcal</span></span>
                    {/* Botões de Ação do CRUD (Update e Delete) */}
                    <EditMealModal meal={meal} onMealUpdated={fetchUserData} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-red-600"
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
