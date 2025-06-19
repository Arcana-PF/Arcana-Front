"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useCart } from "@/context/CartContext";

export default function PaypalSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderID = searchParams.get("token"); // PayPal redirige con ?token=
  const hasCaptured = useRef(false); // previene doble ejecución
  const { clearCart } = useCart();

  useEffect(() => {
    if (!orderID || hasCaptured.current) return;

    hasCaptured.current = true; // previene múltiples capturas

    const capturePayment = async () => {
      try {
        const response = await fetch("/api/paypal-capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderID }),
        });

        const result = await response.json();

        if (response.ok && result.status === "COMPLETED") {
          clearCart(); // vacía el carrito si tienes este método

          await Swal.fire({
            title: "¡Pago exitoso!",
            text: "Gracias por tu compra. Tu pedido ha sido procesado.",
            icon: "success",
            confirmButtonText: "Ver mis pedidos",
            confirmButtonColor: "#facc15",
            background: "#0e0a1f",
            color: "#e5e7eb",
          });

          router.push("/profile/orders");
        } else {
          throw new Error(result.error || "Error al capturar el pago");
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "No se pudo completar el pago. Intenta de nuevo.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
          background: "#0e0a1f",
          color: "#e5e7eb",
        });
      }
    };

    capturePayment();
  }, [orderID, router, clearCart]);

  return (
    <div className="flex items-center justify-center min-h-[40vh] px-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Procesando tu pago mágico...
      </h1>
    </div>
  );
}