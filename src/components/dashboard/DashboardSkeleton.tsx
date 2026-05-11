"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  // Alturas fixas para evitar o erro de Hydration (Math.random causa erro)
  const chartHeights = ["40%", "70%", "55%", "90%", "65%", "45%", "80%"];

  return (
    <div className="flex flex-col space-y-8 animate-pulse">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      
      {/* Cards de Cima */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm border-primary/5">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Área do Gráfico */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="h-[250px] flex items-end gap-2 px-6 pb-6">
            {chartHeights.map((height, i) => (
              <Skeleton key={i} className="flex-1" style={{ height }} />
            ))}
          </CardContent>
        </Card>
        <Skeleton className="h-full w-full rounded-xl" />
      </div>

      {/* Lista de Refeições */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
