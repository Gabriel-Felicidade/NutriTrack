"use client";

import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // Tela de boas-vindas para usuários não logados
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
          <Link 
            href="/register" 
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto text-md shadow-lg shadow-primary/25")}
          >
            Começar Agora
          </Link>
          <Link 
            href="/login" 
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-md bg-white/50 backdrop-blur-sm")}
          >
            Já tenho uma conta
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard Inicial para o usuário logado
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Futuro Card de Calorias */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calorias Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--- kcal</div>
            <p className="text-xs text-muted-foreground mt-1">Configuração pendente</p>
          </CardContent>
        </Card>

        {/* Futuro Card de Jejum */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status do Jejum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">Inativo</div>
            <p className="text-xs text-muted-foreground mt-1">Nenhum jejum em andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-dashed bg-slate-50/50 dark:bg-zinc-950/50">
          <CardHeader>
            <CardTitle>Bem-vindo ao seu painel!</CardTitle>
            <CardDescription>
              Nas próximas etapas, adicionaremos os módulos de controle calórico e cronômetro de jejum aqui.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
