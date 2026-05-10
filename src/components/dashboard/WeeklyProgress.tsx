"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export function WeeklyProgress({ dailyGoal }: { dailyGoal: number }) {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWeeklyData() {
      if (!user) return;

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, "yyyy-MM-dd");
      }).reverse();

      try {
        const mealsRef = collection(db, "users", user.uid, "meals");
        // Buscamos refeições dos últimos 7 dias
        const q = query(
          mealsRef, 
          where("date", ">=", last7Days[0]),
          orderBy("date", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        const mealsByDate: Record<string, number> = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          mealsByDate[data.date] = (mealsByDate[data.date] || 0) + (data.calories || 0);
        });

        const formattedData = last7Days.map(date => ({
          name: format(new Date(date + "T00:00:00"), "EEE", { locale: ptBR }),
          calorias: mealsByDate[date] || 0,
          fullDate: date
        }));

        setChartData(formattedData);
      } catch (e) {
        console.error("Erro ao buscar dados do gráfico:", e);
      }
    }

    fetchWeeklyData();
  }, [user]);

  return (
    <Card className="col-span-full lg:col-span-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Progresso dos Últimos 7 Dias</CardTitle>
        <CardDescription>Consumo calórico diário em relação à sua meta.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-zinc-950 p-2 border rounded-lg shadow-sm text-xs">
                        <p className="font-bold">{payload[0].value} kcal</p>
                        {dailyGoal > 0 && (
                          <p className="text-muted-foreground">
                            {((payload[0].value as number / dailyGoal) * 100).toFixed(0)}% da meta
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="calorias" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.calorias > dailyGoal && dailyGoal > 0 ? "#ef4444" : "#f59e0b"} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
