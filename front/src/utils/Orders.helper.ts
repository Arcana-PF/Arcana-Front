const APIURL = process.env.NEXT_PUBLIC_API_URL;

if (!APIURL) {
  throw new Error('API URL is not defined');
}

export async function createOrder(products: number[], token: string) {
  try {
    const response = await fetch(`${APIURL}/orders`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    alert('Buy successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      throw new Error('Unexpected error occurred');
    }
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