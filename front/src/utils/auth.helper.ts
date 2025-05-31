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
    })

    if (response.ok) {
      alert("usuario registrado correctamente");
      // Aquí puedes manejar la respuesta del servidor, como redirigir al usuario o mostrar un mensaje de éxito
      return await response.json();
    } else {
      const errorData = await response.json(); // Detalles del error
      alert(`Failed to register user: ${errorData.message || 'Unknown error'}`);
      throw new Error("Error en el servidor");
    }
  } catch (error: any) {
    console.error("Error:", error);
    alert(`An error occurred: ${error.message || 'Unknown error'}`);
    throw new Error(error);
  }
}

export async function login(userData: IloginProps) {
    try {
      const response = await fetch(`${APIURL}/auth/signin`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })
  
      if (response.ok) {
        alert("Usuario logueado correctamente");
        // Aquí puedes manejar la respuesta del servidor, como redirigir al usuario o guardar el token
        return await response.json();
      } else {
        const errorData = await response.json(); // Detalles del error
        alert(`Failed to login user: ${errorData.message || 'Unknown error'}`);
        throw new Error("Error en el servidor");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }