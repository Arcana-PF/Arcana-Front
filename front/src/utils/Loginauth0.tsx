"use client";

import React from "react";
import { Sparkles, LogIn } from "lucide-react";

const LoginWithAuth0Button = () => {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold text-sm hover:from-yellow-400 hover:to-yellow-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98] transition-all duration-300"
    >
      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
      Iniciar sesión con el Portal Arcano
      <LogIn className="w-4 h-4 ml-2" />
    </button>
  );
};

export default LoginWithAuth0Button;  