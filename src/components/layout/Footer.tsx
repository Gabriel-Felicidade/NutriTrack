import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50 dark:bg-zinc-950 mt-auto">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="flex items-center text-amber-600 dark:text-amber-500">
            <ShieldAlert className="h-5 w-5 mr-2" />
            <h3 className="font-semibold text-sm">Aviso de Responsabilidade e Saúde</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            O <span className="font-bold text-amber-600">NutriTrack</span> é uma ferramenta de apoio educacional e de monitoramento pessoal. 
            Os cálculos e sugestões fornecidos por esta aplicação não substituem o aconselhamento, 
            diagnóstico ou tratamento médico profissional. Sempre procure a orientação de um 
            nutricionista ou médico qualificado antes de iniciar qualquer dieta, restrição calórica 
            ou prática de jejum intermitente.
          </p>
          <div className="text-xs text-muted-foreground/60 pt-4">
            &copy; {new Date().getFullYear()} NutriTrack. Desenvolvido para fins acadêmicos.
          </div>
        </div>
      </div>
    </footer>
  );
}
