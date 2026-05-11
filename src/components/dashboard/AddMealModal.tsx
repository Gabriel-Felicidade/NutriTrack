"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Utensils } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";


export function AddMealModal({ onMealAdded }: { onMealAdded: () => void }) {
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [type, setType] = useState("Almoço");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) return;
    
    try {
      // Criamos uma nova "refeição" dentro de uma sub-coleção do usuário
      // Isso mantém os dados organizados por dono
      await addDoc(collection(db, "users", user.uid, "meals"), {
        description,
        calories: parseInt(calories),
        type,
        timestamp: serverTimestamp(), // Hora oficial do servidor
        date: format(new Date(), "yyyy-MM-dd")// Data simplificada YYYY-MM-DD
      });
      
      setDescription("");
      setCalories("");
      setOpen(false);
      onMealAdded(); // Avisa a página que uma nova refeição foi criada
    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 shadow-md"><PlusCircle className="h-4 w-4" /> Adicionar Refeição</Button>}>
        <PlusCircle className="h-4 w-4" /> Adicionar Refeição
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Refeição</DialogTitle>
          <DialogDescription>Registre o que você consumiu agora.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(val) => setType(val ?? "Almoço")}>
              <SelectTrigger>
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
            <Label htmlFor="description">O que você comeu?</Label>
            <Input 
              id="description" 
              placeholder="Ex: Arroz, feijão e frango" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="calories">Calorias (kcal)</Label>
            <Input 
              id="calories" 
              type="number" 
              placeholder="Ex: 450" 
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!description || !calories}>Salvar Refeição</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
