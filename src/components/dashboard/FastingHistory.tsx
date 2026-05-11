"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { format, differenceInMinutes, differenceInHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, Trophy, Clock, CheckCircle2 } from "lucide-react";

/**
 * COMPONENTE DE HISTÓRICO E MÉTRICAS DE JEJUM
 * Este componente demonstra habilidades de agregação de dados e cálculos estatísticos 
 * realizados no lado do cliente com dados vindos do Firestore.
 */
export function FastingHistory() {
  const { user } = useAuth();
  const [fasts, setFasts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    averageHours: 0,
    totalFasts: 0,
    longestFast: 0,
  });

  useEffect(() => {
    async function fetchFastingHistory() {
      if (!user) return;

      try {
        const fastsRef = collection(db, "users", user.uid, "fasts");
        
        // QUERY: Buscamos apenas jejuns que já foram encerrados (endTime != null)
        // Ordenamos pelos mais recentes e limitamos aos últimos 10 para performance.
        const q = query(
          fastsRef,
          where("endTime", "!=", null),
          orderBy("endTime", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const fetchedFasts: any[] = [];
        let totalMinutes = 0;
        let maxMinutes = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Conversão de Timestamp do Firebase para objeto Date do JS
          const start = data.startTime.toDate();
          const end = data.endTime.toDate();
          
          // Cálculo da duração usando a biblioteca date-fns
          const durationMinutes = differenceInMinutes(end, start);
          
          totalMinutes += durationMinutes;
          if (durationMinutes > maxMinutes) maxMinutes = durationMinutes;

          fetchedFasts.push({
            id: doc.id,
            durationHours: (durationMinutes / 60).toFixed(1),
            date: format(end, "dd MMM", { locale: ptBR }),
            protocol: data.protocol,
          });
        });

        // ATUALIZAÇÃO DOS ESTADOS DE MÉTRICAS
        setFasts(fetchedFasts);
        setStats({
          // Média aritmética simples das horas de jejum
          averageHours: fetchedFasts.length > 0 ? parseFloat(((totalMinutes / fetchedFasts.length) / 60).toFixed(1)) : 0,
          totalFasts: querySnapshot.size,
          // Recorde (maior duração encontrada na amostra)
          longestFast: parseFloat((maxMinutes / 60).toFixed(1)),
        });
      } catch (e) {
        console.error("Erro ao buscar histórico de jejum:", e);
      }
    }

    fetchFastingHistory();
  }, [user]);

  // Se o usuário ainda não tiver nenhum jejum completo, o card não aparece (UI Limpa)
  if (fasts.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Histórico de Jejum
        </CardTitle>
        <CardDescription>Resumo dos seus últimos ciclos.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* GRID DE ESTATÍSTICAS: Demonstração de dados agregados */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-primary/5">
            <Clock className="h-4 w-4 text-amber-500 mb-1" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Média</span>
            <span className="text-sm font-bold">{stats.averageHours}h</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-primary/5">
            <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total</span>
            <span className="text-sm font-bold">{stats.totalFasts}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-primary/5">
            <Trophy className="h-4 w-4 text-purple-500 mb-1" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Recorde</span>
            <span className="text-sm font-bold">{stats.longestFast}h</span>
          </div>
        </div>

        {/* LISTA ROLÁVEL: Implementação de scroll customizado para manter a altura do layout fixa */}
        <div className="space-y-3 h-[180px] overflow-y-auto pr-2 custom-scrollbar">
          {fasts.map((fast) => (
            <div key={fast.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors border-b last:border-0 border-primary/5">
              <div className="flex flex-col">
                <span className="text-xs font-bold">{fast.date}</span>
                <span className="text-[10px] text-muted-foreground">{fast.protocol}</span>
              </div>
              <div className="text-sm font-mono font-bold text-primary">
                {fast.durationHours}h
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
