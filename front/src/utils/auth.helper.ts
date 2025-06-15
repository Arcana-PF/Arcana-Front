import { IloginProps, IRegisterProps } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegisterProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      // Retorna la respuesta del servidor, la cual el componente puede usar para mostrar un mensaje de éxito
      return await response.json();
    } else {
      const errorData = await response.json(); // Detalles del error
      throw new Error(errorData.message || 'Unknown error');
    }
  } catch (error: unknown) {
    console.error("Error al registrarse:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error');
  }
}


export async function login(userData: IloginProps) {
  try {
    // Verificando el contenido del body antes de enviarlo

    const response = await fetch(`${APIURL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      // Retorna la respuesta del servidor, la cual el componente puede usar para mostrar un mensaje de éxito
      return await response.json();
    } else {
      const errorData = await response.json(); // Detalles del error
      throw new Error(errorData.message || "Unknown error");
    }
  } catch (error: unknown) {
    console.error("Error al iniciar sesión:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error");
  }
}