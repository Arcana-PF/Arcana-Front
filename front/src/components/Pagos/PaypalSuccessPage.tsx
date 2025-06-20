"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useCart } from "@/context/CartContext";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function PaypalSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderID = searchParams.get("token");
  const localOrderId = searchParams.get("localOrderId") || "";
  const hasCaptured = useRef(false);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderID || hasCaptured.current) return;

    hasCaptured.current = true;

    const capturePayment = async () => {
      try {
        const url = `${APIURL?.replace(/\/$/, "")}/orders/paypal/capture`;
        console.log("→ Capturing payment via:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Se quitó credentials: "include"
          body: JSON.stringify({
            orderId: orderID,
            localOrderId,
          }),
        });

        const contentType = response.headers.get("Content-Type") || "";
        const rawText = await response.text();
        console.log("→ Raw response from server:", rawText);

        if (!contentType.includes("application/json")) {
          throw new Error("Respuesta inesperada del servidor (no es JSON)");
        }

        const result = JSON.parse(rawText);

        if (response.ok && result.status === "PAID") {
          clearCart();
          setLoading(false);

          await Swal.fire({
            title: "¡Pago exitoso!",
            text: "Gracias por tu compra. Tu pedido ha sido procesado.",
            icon: "success",
            confirmButtonText: "Ir a mi perfil",
            confirmButtonColor: "#facc15",
            background: "#0e0a1f",
            color: "#e5e7eb",
          });

          router.push("/profile");
        } else {
          throw new Error(result.error || "Error al capturar el pago");
        }
      } catch (err) {
        console.error("⚠️ Error capturando pago:", err);
        await Swal.fire({
          title: "Error",
          text: "No se pudo completar el pago. Intenta de nuevo.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
          background: "#0e0a1f",
          color: "#e5e7eb",
        });
        router.push("/cart/canceledpage");
      }
    };

    capturePayment();
  }, [orderID, router, clearCart, localOrderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Procesando tu pago mágico...
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Estamos confirmando con los escribas de PayPal que el oro ha sido entregado.
      </p>
    </div>
  );
}