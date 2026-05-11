"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface Meal {
  id: string;
  description: string;
  calories: number;
  type: string;
  date: string;
}

export function EditMealModal({ meal, onMealUpdated }: { meal: Meal; onMealUpdated: () => void }) {
  const [description, setDescription] = useState(meal.description);
  const [calories, setCalories] = useState(meal.calories.toString());
  const [type, setType] = useState(meal.type);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleUpdate = async () => {
    if (!user) return;
    
    try {
      const mealRef = doc(db, "users", user.uid, "meals", meal.id);
      
      await updateDoc(mealRef, {
        description,
        calories: parseInt(calories),
        type,
      });
      
      setOpen(false);
      onMealUpdated(); // Recarrega os dados na dashboard
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
          />
        }
      >
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Refeição</DialogTitle>
          <DialogDescription>Altere as informações da sua refeição.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-type">Tipo</Label>
            <Select value={type} onValueChange={(val) => setType(val)}>
              <SelectTrigger id="edit-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Café da Manhã">Café da Manhã</SelectItem>
                <SelectItem value="Almoço">Almoço</SelectItem>
                <SelectItem value="Café da Tarde">Café da Tarde</SelectItem>
                <SelectItem value="Jantar">Jantar</SelectItem>
                <SelectItem value="Lanche/Outro">Lanche/Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">O que você comeu?</Label>
            <Input 
              id="edit-description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-calories">Calorias (kcal)</Label>
            <Input 
              id="edit-calories" 
              type="number" 
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={!description || !calories}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
