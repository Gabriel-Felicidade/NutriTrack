"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Play, Square, Zap, ChevronDown } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export function FastingTimer() {
  const { user } = useAuth();
  const [activeFast, setActiveFast] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [protocol, setProtocol] = useState("16:8");

  // 1. Busca se existe um jejum ativo no Firebase
  useEffect(() => {
    async function checkActiveFast() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "fasts"),
          where("endTime", "==", null),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fastDoc = querySnapshot.docs[0];
          setActiveFast({ id: fastDoc.id, ...fastDoc.data() });
        }
      } catch (e) {
        console.error("Erro ao buscar jejum ativo:", e);
      }
    }
    checkActiveFast();
  }, [user]);

  // 2. Lógica do Cronômetro
  useEffect(() => {
    let interval: any;
    if (activeFast && activeFast.startTime) {
      interval = setInterval(() => {
        const start = activeFast.startTime.toDate ? activeFast.startTime.toDate() : new Date(activeFast.startTime);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
        
        if (diff < 0) return;

        const h = Math.floor(diff / 3600).toString().padStart(2, "0");
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
        const s = (diff % 60).toString().padStart(2, "0");
        
        setElapsedTime(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [activeFast]);

  const startFast = async () => {
    if (!user) return;
    try {
      const startTime = new Date();
      const newFastData = {
        startTime: startTime,
        endTime: null,
        protocol: protocol, // Usa o protocolo selecionado
      };
      const docRef = await addDoc(collection(db, "users", user.uid, "fasts"), newFastData);
      setActiveFast({ id: docRef.id, ...newFastData, startTime: { toDate: () => startTime } });
    } catch (e) {
      console.error("Erro ao iniciar jejum:", e);
    }
  };

  const endFast = async () => {
    if (!user || !activeFast) return;
    try {
      const fastRef = doc(db, "users", user.uid, "fasts", activeFast.id);
      await updateDoc(fastRef, {
        endTime: serverTimestamp()
      });
      setActiveFast(null);
      setElapsedTime("00:00:00");
    } catch (e) {
      console.error("Erro ao encerrar jejum:", e);
    }
  };

  return (
    <Card className={`shadow-md transition-all duration-500 ${activeFast ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Timer className={`h-4 w-4 ${activeFast ? 'text-amber-500 animate-pulse' : ''}`} /> Status do Jejum
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-mono font-bold tracking-widest text-slate-800 dark:text-slate-200">
            {elapsedTime}
          </div>
          
          {activeFast ? (
            <div className="flex flex-col items-center w-full gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Zap className="h-3 w-3 fill-current" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Jejum Ativo: {activeFast.protocol}</span>
              </div>
              <Button variant="destructive" className="w-full gap-2 shadow-lg shadow-red-500/20" onClick={endFast}>
                <Square className="h-4 w-4 fill-current" /> Encerrar Jejum
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <div className="space-y-1.5 flex flex-col items-center">
                {/* O Badge de "Escolha o Ciclo" agora aparece antes de começar */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Escolha o ciclo</span>
                </div>
                
                <Select value={protocol} onValueChange={(val) => setProtocol(val ?? "16:8")}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Selecione o ciclo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12:12">12:12 (Leve)</SelectItem>
                    <SelectItem value="14:10">14:10 (Iniciante)</SelectItem>
                    <SelectItem value="16:8">16:8 (Padrão)</SelectItem>
                    <SelectItem value="18:6">18:6 (Avançado)</SelectItem>
                    <SelectItem value="20:4">20:4 (Guerreiro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="default" className="w-full gap-2 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20" onClick={startFast}>
                <Play className="h-4 w-4 fill-current" /> Iniciar Jejum
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
