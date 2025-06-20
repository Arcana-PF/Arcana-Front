"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { capturePaypalOrder } from "@/utils/Orders.helper";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const PaypalSuccessPage = () => {
  const searchParams = useSearchParams();
  const { userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const captureOrder = async () => {
      const orderId = searchParams.get("token");
      const localOrderId = searchParams.get("localOrderId");

      // 🪵 Log de parámetros entrantes
      console.log("✔️ Parámetros recibidos desde PayPal:");
      console.log({ orderId, localOrderId });
      console.log("✔️ Token del usuario:", userData?.token);

      if (!orderId || !localOrderId || !userData?.token) {
        Swal.fire({
          title: "Error de captura",
          text: "Faltan parámetros necesarios para procesar el pago.",
          icon: "error",
        });
        setLoading(false);
        return;
      }

      const result = await capturePaypalOrder(orderId, localOrderId, userData.token);

      // 🪵 Log de resultado del fetch
      console.log("📦 Resultado de capturePaypalOrder:", result);

      if (result.success && result.data?.status === "PAID") {
        await Swal.fire({
          title: "Pago exitoso",
          text: "Tu orden ha sido confirmada como pagada.",
          icon: "success",
          confirmButtonText: "Ver mis pedidos",
        });
        router.push("/profile/orders")
      } else {
        Swal.fire({
          title: "Pago no confirmado",
          text:
            typeof result.error === "string"
              ? result.error
              : "No se recibió confirmación de pago. Verifica tu cuenta o intenta de nuevo.",
          icon: "error",
        });
        setLoading(false);
      }
    };

    captureOrder();
  }, [searchParams, userData?.token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p className="text-gray-600 text-lg">Confirmando tu pago...</p>
      ) : (
        <p className="text-gray-600 text-lg">Procesamiento finalizado.</p>
      )}
    </div>
  );
};

export default PaypalSuccessPage;