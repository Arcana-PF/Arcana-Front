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
  } catch (error: any) {
    console.error("Error:", error);
    throw new Error(error.message || 'Unknown error');
  }
}

export async function login(userData: IloginProps) {
  try {
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.validationToken);
      console.log("Token guardado en localStorage:", localStorage.getItem("token"));
      return data;
    } else {
      throw new Error(data.message || "Error desconocido");
    }
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}