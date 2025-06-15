"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Swal from "sweetalert2";


const APIURL = process.env.NEXT_PUBLIC_API_URL;

const CheckoutComponent = () => {
  const { cart, totalPrice } = useCart();

  const handlePayPalCheckout = async () => {
    try {
      // ✅ Mostrar alerta antes de redirigir a PayPal
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

      if (!confirmPayment.isConfirmed) return; // ✅ Si cancela, no procede con el pago

      // ✅ Crear la transacción en el backend con `orderId` y `localOrderId`
      const response = await fetch("${APIURL}/paypal/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            localOrderId: cart.id, // Usamos el ID del carrito como referencia local
            user: cart.user, // Información del comprador
            totalPrice,
            items: cart.items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error en PayPal");

      // ✅ Alerta de éxito y obtención del `orderId` del backend
      Swal.fire({
        title: "Pago confirmado",
        text: `Tu orden ha sido registrada con ID ${data.orderId}. Serás enviado a la pasarela de pago.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      window.location.href = data.redirect_url; // ✅ Redirige al usuario a PayPal

    } catch (error) {
      console.error("Error en el pago:", error);

      // ✅ Alerta de error en caso de fallo
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
    </div>
  );
};

export default CheckoutComponent;