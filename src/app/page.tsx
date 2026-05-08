"use client";

import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/img/Logotipo-claro-removebg-preview.png"
          alt="NutriTrack Logo"
          width={200}
          height={100}
          priority
        />
        <h1 className="text-4xl font-bold text-center">Bem-vindo ao NutriTrack</h1>
      </div>

      {user ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg">Olá, <span className="font-semibold">{user.email}</span>!</p>
          <Button onClick={logout} variant="outline">Sair</Button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link 
            href="/login" 
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Fazer Login
          </Link>
          <Link 
            href="/register" 
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cadastrar
          </Link>
        </div>
      )}
      
      <p className="text-xs text-gray-500 max-w-md text-center">
        Aviso: Esta aplicação não substitui orientação médica ou nutricional.
      </p>
    </main>
  );
}
