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

/**
 * MODAL DE ADIÇÃO DE REFEIÇÃO (CRUD - CREATE)
 * Este componente é responsável por capturar a entrada do usuário e persistir
 * um novo documento na sub-coleção "meals" do Firestore.
 */
export function AddMealModal({ onMealAdded }: { onMealAdded: () => void }) {
  // ESTADOS LOCAIS: Controlam os inputs do formulário
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [type, setType] = useState("Almoço");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) return;
    
    try {
      // PERSISTÊNCIA: Criamos uma nova "refeição" dentro da sub-coleção do usuário atual.
      // Isso implementa um padrão de segurança onde cada usuário só acessa seus próprios dados.
      await addDoc(collection(db, "users", user.uid, "meals"), {
        description,
        calories: parseInt(calories),
        type,
        // serverTimestamp garante que a hora gravada seja a do servidor, evitando fraudes locais
        timestamp: serverTimestamp(), 
        // Armazenamos a data formatada para facilitar filtros e agrupamentos na Dashboard
        date: format(new Date(), "yyyy-MM-dd")
      });
      
      // RESET: Limpa os campos e fecha o modal após o salvamento
      setDescription("");
      setCalories("");
      setOpen(false);
      
      // NOTIFICAÇÃO: Avisa o componente pai que os dados mudaram (trigger para re-fetch)
      onMealAdded(); 
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
          {/* VALIDAÇÃO: O botão só é habilitado se houver descrição e calorias */}
          <Button onClick={handleSave} disabled={!description || !calories}>Salvar Refeição</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
