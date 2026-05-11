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

/**
 * MODAL DE EDIÇÃO DE REFEIÇÃO (CRUD - UPDATE)
 * Este componente gerencia a atualização de um registro existente no Firestore.
 * Demonstra o uso de formulários controlados e persistência de dados.
 */
export function EditMealModal({ meal, onMealUpdated }: { meal: Meal; onMealUpdated: () => void }) {
  // ESTADOS LOCAIS: Inicializados com os dados atuais da refeição
  const [description, setDescription] = useState(meal.description);
  const [calories, setCalories] = useState(meal.calories.toString());
  const [type, setType] = useState(meal.type);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleUpdate = async () => {
    if (!user) return;
    
    try {
      // REFERÊNCIA: Aponta exatamente para o documento da refeição na sub-coleção do usuário
      const mealRef = doc(db, "users", user.uid, "meals", meal.id);
      
      // OPERAÇÃO ASSÍNCRONA: Atualiza apenas os campos modificados
      await updateDoc(mealRef, {
        description,
        calories: parseInt(calories),
        type,
      });
      
      setOpen(false); // Fecha o modal após o sucesso
      onMealUpdated(); // Callback para notificar a Dashboard e recarregar a lista
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 
          DICA TÉCNICA: Usamos a prop 'render' em vez de 'asChild' para garantir 
          compatibilidade total com a biblioteca Base UI utilizada no projeto.
      */}
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
            <Select value={type} onValueChange={(val) => setType(val as string)}>
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
          {/* BOTÃO DE AÇÃO: Desabilitado se os campos obrigatórios estiverem vazios */}
          <Button onClick={handleUpdate} disabled={!description || !calories}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
