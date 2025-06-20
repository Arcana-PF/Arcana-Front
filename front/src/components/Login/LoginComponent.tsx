"use client";
import { useState, useEffect } from "react";
import { validateLoginForm } from "@/app/lib/validate";
import { useAuth } from "@/context/AuthContext";
import { login, auth0Login } from "@/utils/auth.helper";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles, UserPlus } from "lucide-react";
import React from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useAuth0 } from "@auth0/auth0-react";

const LoginComponent = () => {
  const router = useRouter();
  const { setUserData, userData } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  // Redirige si ya hay sesión
  useEffect(() => {
    if (userData) {
      router.push("/");
    }
  }, [userData, router]);

  // Función para realizar el intercambio de token con Auth0 en el backend
  const handleAuth0Login = async () => {
    try {
      Swal.fire({
        title: "Redirigiendo a Auth0...",
        text: "Preparando los portales mágicos...",
        background: "#0e0a1f",
        color: "#e5e7eb",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const auth0Token = await getAccessTokenSilently();
      const response = await auth0Login(auth0Token); // Función que envía { token: auth0Token } a tu backend

      const sessionData = {
        validationToken: response.validationToken,
        token: response.validationToken,
        user: response.user,
      };

      setUserData(sessionData);
      localStorage.setItem("userSession", JSON.stringify(sessionData));
      Cookies.set("userSession", JSON.stringify(sessionData), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      Swal.close();

      await Swal.fire({
        icon: "success",
        title: `¡Bienvenido, ${response.user?.name || "arcano"}!`,
        text: "Has accedido exitosamente con Auth0.",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#facc15",
        background: "#0e0a1f",
        color: "#e5e7eb",
        timer: 3000,
        timerProgressBar: true,
      });

      router.push("/");
    } catch (error) {
      Swal.close();
      console.error("Error durante login con Auth0:", error);
      await Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No se pudo completar el login mágico con Auth0.",
        confirmButtonColor: "#7c3aed",
        background: "#0e0a1f",
        color: "#e5e7eb",
      });
    }
  };

  return (
    <div className="mt-25 fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-black overflow-auto">
      {/* Fondos animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Contenedor principal */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500 mr-2 animate-pulse" />
              <h1 className="text-4xl font-extrabold text-yellow-600">Acceso Arcano</h1>
              <Sparkles className="w-8 h-8 text-yellow-500 ml-2 animate-pulse" />
            </div>
            <p className="text-gray-300 text-sm">Ingresar al Círculo Arcano</p>
          </div>

          {/* Formik para login tradicional */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={validateLoginForm}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                Swal.fire({
                  title: "Invocando acceso...",
                  text: "Conectando con el plano arcano",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  showConfirmButton: false,
                  background: "#0e0a1f",
                  color: "#e5e7eb",
                  didOpen: () => Swal.showLoading(),
                });

                const response = await login(values);
                const { validationToken, user } = response;

                if (!user) {
                  throw new Error("No se encontró información del usuario.");
                }

                const sessionData = {
                  validationToken,
                  token: validationToken,
                  user,
                };

                setUserData(sessionData);
                localStorage.setItem("userSession", JSON.stringify(sessionData));
                Cookies.set("userSession", JSON.stringify(sessionData), {
                  path: "/",
                  sameSite: "lax",
                  secure: process.env.NODE_ENV === "production",
                });

                Swal.close();

                await Swal.fire({
                  icon: "success",
                  title: `¡Bienvenido de vuelta, ${user.name}!`,
                  text: "Has accedido exitosamente al Círculo Arcano.",
                  confirmButtonText: "Continuar",
                  confirmButtonColor: "#facc15",
                  background: "#0e0a1f",
                  color: "#e5e7eb",
                  timer: 3000,
                  timerProgressBar: true,
                });

                router.push("/");
              } catch (error: unknown) {
                Swal.close();
                console.error("Error al iniciar sesión:", error);
                const message =
                  error instanceof Error ? error.message : "Ocurrió un problema desconocido.";
                await Swal.fire({
                  icon: "error",
                  title: "Error al iniciar sesión",
                  text: message,
                  confirmButtonText: "Intentar de nuevo",
                  confirmButtonColor: "#7c3aed",
                  background: "#0e0a1f",
                  color: "#e5e7eb",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Campo de Email */}
                <div className="group">
                  <label className="flex items-center text-white font-medium mb-2">
                    <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                    Email Arcano
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="tuemail@circulo.arcano"
                      className={`w-full p-4 pl-12 border rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${
                        errors.email && touched.email
                          ? "border-red-500 focus:border-red-400 focus:ring-red-400/20"
                          : "border-yellow-500/30 focus:border-yellow-400 focus:ring-yellow-400/20"
                      }`}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-400 mt-2 text-sm" />
                </div>

                {/* Campo de Contraseña */}
                <div className="group">
                  <label className="flex items-center text-white font-medium mb-2">
                    <Lock className="w-4 h-4 mr-2 text-yellow-500" />
                    Contraseña Secreta
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Tu palabra de poder"
                      className={`w-full p-4 pl-12 pr-12 border rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${
                        errors.password && touched.password
                          ? "border-red-500 focus:border-red-400 focus:ring-red-400/20"
                          : "border-yellow-500/30 focus:border-yellow-400 focus:ring-yellow-400/20"
                      }`}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-400 mt-2 text-sm" />
                </div>

                {/* Botón para submit del formulario */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                      isSubmitting || Object.keys(errors).length > 0
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98]"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Invocando acceso...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Ingresar al Círculo
                        <Sparkles className="w-5 h-5 ml-2" />
                      </div>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Botón adicional para iniciar sesión con Auth0 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAuth0Login}
              className="w-full py-3 mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
            >
              Acceder con Auth0 🔐
            </button>
          </div>

          {/* Enlace para registro */}
          <div className="text-center mt-6 pt-4 border-t border-yellow-500/20">
            <p className="text-gray-400 text-sm mb-3">¿No tienes una cuenta?</p>
            <Link
              href="/register"
              className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors font-medium text-sm bg-yellow-500/10 hover:bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Únete al Círculo Arcano
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;