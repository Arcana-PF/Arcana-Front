"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function PaypalCancelPage() {
  const router = useRouter();
  const [modalShown, setModalShown] = useState(false);

  useEffect(() => {
    if (modalShown) return;

    setModalShown(true);

    Swal.fire({
      title: "Invocación interrumpida",
      text: "Has cancelado el pago con PayPal. No se ha realizado ningún cargo.",
      icon: "info",
      confirmButtonText: "Volver al carrito",
      confirmButtonColor: "#7c3aed",
      background: "#0e0a1f",
      color: "#e5e7eb",
    }).then(() => {
      router.push("/cart");
    });
  }, [modalShown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Cancelando el ritual de pago...
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Tu conexión con el plano etéreo fue interrumpida. Puedes intentar nuevamente cuando estés listo.
      </p>

      {/* Botón extra al perfil */}
      <button
        onClick={() => router.push("/profile")}
        className="mt-6 bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-lg text-black font-semibold transition-all duration-300"
      >
        Ir a mi perfil
      </button>
    </div>
  );
}