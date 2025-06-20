import { ICart } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Tipos auxiliares
interface CreateOrderSuccess {
  success: true;
  orderId: string;
  localOrderId: string;
}

interface CreateOrderError {
  success: false;
  error: any;
}

export type CreateOrderResult = CreateOrderSuccess | CreateOrderError;

interface InitiateOrderResult {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

// Obtener todas las órdenes
export async function getOrders(token: string) {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" };
  }

  try {
    const response = await fetch(`${APIURL}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Unknown error");
      console.error(`Error ${response.status}:`, errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

// Obtener una orden específica
export async function getOrder(orderId: string, token: string) {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" };
  }

  try {
    const response = await fetch(`${APIURL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Unknown error");
      console.error(`Error ${response.status}:`, errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

// Crear orden de PayPal
export async function createPaypalOrder(cart: ICart, token: string): Promise<CreateOrderResult> {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" };
  }

  try {
    const response = await fetch(`${APIURL}/orders/paypal/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart }), // Asegúrate que tu backend espera { cart }
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Unknown error");
      console.error(`Error ${response.status}:`, errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return {
      success: true,
      orderId: data.orderId,
      localOrderId: data.localOrderId,
    };
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

// Iniciar pago con PayPal
export async function initiatePaypalOrder(orderId: string, token: string): Promise<InitiateOrderResult> {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(`${APIURL}/orders/paypal/initiate/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const rawData = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      return { success: false, error: "Sesión expirada. Por favor, inicia sesión nuevamente." };
    }

    if (!response.ok || !rawData) {
      const errorMessage = typeof rawData === "string" ? rawData : `HTTP ${response.status} error`;
      return { success: false, error: errorMessage };
    }

    const redirectUrl = rawData.redirectUrl || rawData?.data?.redirectUrl;
    if (!redirectUrl) {
      console.error("redirectUrl not found in response data:", rawData);
      return { success: false, error: "redirectUrl not found in response" };
    }

    return { success: true, redirectUrl };
  } catch (error: unknown) {
    clearTimeout(timeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "Tiempo de espera agotado" };
    }
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}

// Capturar orden de PayPal
export async function capturePaypalOrder(orderId: string, localOrderId: string, token: string) {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" };
  }

  const payload = { orderId, localOrderId };

  try {
    const response = await fetch(`${APIURL}/orders/paypal/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Unknown error");
      console.error(`Error ${response.status}:`, errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}