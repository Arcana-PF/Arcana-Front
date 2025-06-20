"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { createPaypalOrder, initiatePaypalOrder } from "@/utils/Orders.helper";

const CheckoutComponent: React.FC = () => {
  const { cart, totalPrice } = useCart();
  const { userData } = useAuth();
  const [orderId, setOrderId] = useState<string>("");

  const handlePayPalCheckout = async () => {
    try {
      const confirmPayment = await Swal.fire({
        title: "Confirmar pago",
        text: `Vas a pagar un total de $${totalPrice.toFixed(2)} MXN. ¿Deseas continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, proceder al pago",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        allowOutsideClick: false,
      });

      if (!confirmPayment.isConfirmed) return;

      const createResult = await createPaypalOrder(cart, userData!.token);

      if (!createResult.success) {
        throw new Error(
          typeof createResult.error === "string"
            ? createResult.error
            : "Error desconocido al crear la orden"
        );
      }

      const { orderId: paypalOrderId, localOrderId } = createResult;

      if (!localOrderId) {
        throw new Error("El backend no devolvió localOrderId");
      }

      setOrderId(paypalOrderId);

      // ✅ Usar localOrderId para iniciar la orden (NO el paypalOrderId)
      const initiateResult = await initiatePaypalOrder(localOrderId, userData!.token);

      if (!initiateResult.success || !initiateResult.redirectUrl) {
        throw new Error(
          typeof initiateResult.error === "string"
            ? initiateResult.error
            : "Error desconocido en la redirección"
        );
      }

      // ✅ Agregar localOrderId a la redirección final
      const separator = initiateResult.redirectUrl.includes("?") ? "&" : "?";
      const finalRedirectUrl = `${initiateResult.redirectUrl}${separator}localOrderId=${localOrderId}`;

      // Logs útiles para verificar redirección y localOrderId
      console.log("🔗 Redirigiendo a:", finalRedirectUrl);
      console.log("🧠 localOrderId en redirección:", localOrderId);

      await Swal.fire({
        title: "Pago iniciado",
        text: "Haz clic en el botón para continuar a PayPal.",
        icon: "info",
        confirmButtonText: "Ir a PayPal",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = finalRedirectUrl;
        }
      });
    } catch (error) {
      console.error("Error en el pago:", error);
      Swal.fire({
        title: "Pago fallido",
        text: "No se pudo procesar el pago. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="checkout-container">
      <button
        onClick={handlePayPalCheckout}
        className="w-full max-w-xs flex items-center justify-center gap-2 bg-[#FFC439] hover:bg-[#FFB422] text-black font-semibold py-3 px-5 rounded-lg shadow-md transition-all"
      >
        <span>Pagar con PayPal</span>
      </button>
      {orderId && <p>Orden creada con PayPal ID: {orderId}</p>}
    </div>
  );
};

export default CheckoutComponent;