import { ICart } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

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
        Authorization: `Bearer ${token}`, // Usamos el formato Bearer
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
      error: error instanceof Error
        ? error.message
        : "Unexpected error occurred",
    };
  }
}
export async function createPaypalOrder(cart: ICart, token: string) {
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
      body: JSON.stringify(cart),
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Unknown error");
      console.error(`Error ${response.status}:`, errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    // Supongamos que el endpoint retorna { orderId: string }
    return { success: true, orderId: data.orderId };
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}


export async function initiatePaypalOrder(orderId: string, token: string) {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" };
  }

  try {
    const response = await fetch(`${APIURL}/orders/paypal/initiate/${orderId}`, {
      method: "POST",
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

    // Parseamos la respuesta JSON.
    const data = await response.json().catch(() => ({}));
    // Buscamos redirectUrl ya sea en data o en data.data.
    const redirectUrl = data.redirectUrl || (data.data && data.data.redirectUrl);
    if (!redirectUrl) {
      console.error("redirectUrl not found in response data:", data);
      return { success: false, error: "redirectUrl not found in response" };
    }

    return { success: true, redirectUrl };
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}


export async function capturePaypalOrder(
  orderId: string,
  localOrderId: string,
  token: string
) {
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
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error occurred",
    };
  }
}
