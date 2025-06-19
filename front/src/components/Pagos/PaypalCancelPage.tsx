"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function PaypalCancelPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: "Invocación interrumpida",
      text: "Has cancelado el pago con PayPal. No se ha realizado ningún cargo.",
      icon: "info",
      confirmButtonText: "Volver al carrito",
      confirmButtonColor: "#7c3aed",
      background: "#0e0a1f",
      color: "#e5e7eb",
    }).then(() => {
      router.push("/carrito");
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh] px-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Cancelando el ritual de pago...
      </h1>
    </div>
  );
}