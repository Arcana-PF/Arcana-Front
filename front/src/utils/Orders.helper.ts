const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function createOrder(products: number[], token: string) {
  if (!APIURL) {
    console.error("API URL is not defined");
    return { success: false, error: "API URL missing" }; // ✅ No detiene la ejecución global
  }

  try {
    const response = await fetch(`${APIURL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Usa formato de autorización estándar
      },
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Unknown error");
      console.error(`Error ${response.status}:`, errorMessage);
      return { success: false, error: errorMessage };
    }

    return { success: true }; // ✅ Retorna resultado en lugar de usar `alert()`
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unexpected error occurred" };
  }
}

export async function getOrders(token: string) {
  try {
    const response = await fetch(`${APIURL}/orders`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      throw new Error('Unexpected error occurred');
    }
  }
}