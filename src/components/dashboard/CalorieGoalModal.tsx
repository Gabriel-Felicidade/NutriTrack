"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, AlertTriangle } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function CalorieGoalModal({
  currentGoal,
  onGoalUpdate,
}: {
  currentGoal: number;
  onGoalUpdate: (newGoal: number) => void;
}) {
  const [goal, setGoal] = useState(currentGoal.toString());
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) return;
    const numGoal = parseInt(goal);

    try {
      // Aqui salvamos no Firebase Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          dailyGoal: numGoal,
        },
        { merge: true },
      );

      onGoalUpdate(numGoal);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
    }
  };

  const isLowGoal = parseInt(goal) < 1200;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <Target className="h-4 w-4" />
        {currentGoal > 0 ? "Editar Meta" : "Definir Meta"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Meta Calórica Diária</DialogTitle>
          <DialogDescription>
            Defina quantas calorias você deseja consumir por dia para atingir
            seu objetivo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="goal">Meta (kcal)</Label>
            <Input
              id="goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onFocus={(e) => e.target.select()} // <-- Adicione isso para facilitar a digitação
              placeholder="Ex: 2000"
              className="col-span-3"
            />
          </div>

          {/* AVISO ÉTICO/SAÚDE: Se a meta for menor que 1200 */}
          {isLowGoal && goal !== "" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs italic">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Atenção: Metas abaixo de 1200 kcal são consideradas muito baixas
                para a maioria dos adultos. Isso pode afetar sua saúde. Consulte
                um profissional.
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!goal || parseInt(goal) <= 0}>
            Salvar Meta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
