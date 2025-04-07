"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonnelRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page équipe avec un délai léger pour assurer que la navigation fonctionne
    const redirect = setTimeout(() => {
      router.push("/equipe");
    }, 10);

    return () => clearTimeout(redirect);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#141414] text-white">
      <div className="p-8 bg-[#2a2a2a]/80 rounded-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Redirection en cours...</h2>
        <p className="mb-4">Vous êtes redirigé vers notre page équipe</p>
        <div className="w-full h-1 bg-[#C4B5A2] relative overflow-hidden">
          <div className="absolute h-full bg-white animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
} 