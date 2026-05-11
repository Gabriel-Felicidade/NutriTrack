"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, // Importamos o Grupo
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ModeToggle";

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-40 flex items-center justify-center">
               <Image
                src="/img/Logotipo-claro-removebg-preview.png"
                alt="NutriTrack Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/img/Logotipo-escuro-removebg-preview.png"
                alt="NutriTrack Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* BOTÃO DE MODO ESCURO AQUI */}
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Envolvemos a Label em um Group para resolver o erro do Base UI */}
              <DropdownMenuGroup>
                <div className="px-2 py-1.5 flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Minha Conta</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
