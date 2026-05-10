"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalorieGoalModal } from "@/components/dashboard/CalorieGoalModal";
import { AddMealModal } from "@/components/dashboard/AddMealModal";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Utensils, Zap } from "lucide-react";
import Image from "next/image";
import { FastingTimer } from "@/components/dashboard/FastingTimer";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";


interface Meal {
  id: string;
  description: string;
  calories: number;
  type: string;
  date: string;
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      // 1. Busca a Meta
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDailyGoal(docSnap.data().dailyGoal || 0);
      }

      // 2. Busca as Refeições do Dia Atual
      const today = new Date().toISOString().split('T')[0];
      const mealsRef = collection(db, "users", user.uid, "meals");
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

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDeleteMeal = async (mealId: string) => {
    if (!user) return;
    if (!confirm("Tem certeza que deseja excluir esta refeição?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "meals", mealId));
      fetchUserData(); // Recarrega a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir refeição:", error);
    }
  };

  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const progressPercentage = dailyGoal > 0 ? Math.min((totalCalories / dailyGoal) * 100, 100) : 0;

  if (authLoading || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Carregando seus dados...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-white rounded-full shadow-lg dark:bg-white/10">
            <Image src="/img/Logotipo-claro-removebg-preview.png" alt="Logo" width={220} height={110} priority className="object-contain" />
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

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
          <p className="text-muted-foreground text-sm">Resumo do seu dia: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex gap-2">
          <CalorieGoalModal currentGoal={dailyGoal} onGoalUpdate={setDailyGoal} />
          <AddMealModal onMealAdded={fetchUserData} />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card de Meta */}
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

        {/* Card de Consumo Real */}
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

        {/* NOSSO NOVO CRONÔMETRO DE JEJUM AQUI! */}
        <FastingTimer />
      </div>

            {/* GRÁFICO SEMANAL */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WeeklyProgress dailyGoal={dailyGoal} />
        
        {/* Espaço para um futuro card lateral (ex: Curiosidade ou Dica do Dia) */}
        <Card className="shadow-sm border-dashed flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-zinc-950/50">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="font-semibold">Dica de Saúde</h3>
          <p className="text-xs text-muted-foreground mt-2">
            Manter uma constância na sua meta diária ajuda seu metabolismo a se ajustar melhor aos períodos de jejum.
          </p>
        </Card>
      </div>

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
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-lg">{meal.calories} <span className="text-xs font-normal text-muted-foreground">kcal</span></span>
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
