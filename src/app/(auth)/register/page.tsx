"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erro anterior
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redireciona para a home após o cadastro
    } catch (err: any) {
      console.error("Erro no Firebase:", err.code, err.message);
      
      // Tradução de erros comuns do Firebase para o usuário
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está sendo usado por outra conta.");
      } else if (err.code === "auth/invalid-email") {
        setError("O formato do e-mail digitado é inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("O cadastro por e-mail não está ativado no Console do Firebase.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Erro de rede. Verifique sua conexão com a internet.");
      } else {
        setError("Ocorreu um erro ao criar a conta: " + err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-12">
      <Link href="/" className="mb-6">
        <Image 
          src="/img/Logotipo-claro-removebg-preview.png" 
          alt="NutriTrack Logo" 
          width={240} 
          height={120} 
          className="object-contain dark:hidden"
          priority
        />
        <Image 
          src="/img/Logotipo-escuro-removebg-preview.png" 
          alt="NutriTrack Logo" 
          width={240} 
          height={120} 
          className="object-contain hidden dark:block"
          priority
        />
      </Link>
      <Card className="w-full max-w-md shadow-lg border-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Comece sua jornada para uma vida mais saudável hoje.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="No mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
            <p className="text-sm text-center text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
