"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone, Sparkles } from "lucide-react"
import { validateRegisterForm } from "@/app/lib/validate"
import { register } from "@/utils/auth.helper"

const RegisterComponent = () => {
  const [showPassword, setShowPassword] = useState(false)

  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      router.push("/"); // Redirige al home si ya está logueado
    }
  }, [userData, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black flex items-center justify-center p-4">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
      
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-4xl font-extrabold text-yellow-600">
              Arcana {/* sustituir por logo */}
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-gray-300 text-sm">Únete a nuestro círculo místico</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "", name: "", address: "", phone: "" }}
          validate={validateRegisterForm}
          onSubmit={async (values) => {
            await register(values);
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6">
              {/* Nombre completo */}
              <div className="group">
                <label className="flex items-center text-white font-medium mb-2">
                  <User className="w-4 h-4 mr-2 text-yellow-500" />
                  Nombre Completo
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Tu nombre completo"
                    className="w-full p-4 pl-12 border border-yellow-500/30 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 backdrop-blur-sm"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <ErrorMessage name="name" component="div" className="text-red-400 mt-2 text-sm flex items-center" />
              </div>

              {/* Grid para email y password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="group">
                  <label className="flex items-center text-white font-medium mb-2">
                    <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                    Email
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      placeholder="tuemail@ejemplo.com"
                      className="w-full p-4 pl-12 border border-yellow-500/30 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 backdrop-blur-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-400 mt-2 text-sm" />
                </div>

                {/* Password */}
                <div className="group">
                  <label className="flex items-center text-white font-medium mb-2">
                    <Lock className="w-4 h-4 mr-2 text-yellow-500" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña robusta"
                      className="w-full p-4 pl-12 pr-12 border border-yellow-500/30 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 backdrop-blur-sm"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-400 mt-2 text-sm" />
                </div>
              </div>

              {/* Grid para dirección y teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dirección */}
                <div className="group">
                  <label className="flex items-center text-white font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                    Dirección
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      name="address"
                      placeholder="Tu dirección"
                      className="w-full p-4 pl-12 border border-yellow-500/30 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 backdrop-blur-sm"
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <ErrorMessage name="address" component="div" className="text-red-400 mt-2 text-sm" />
                </div>

                {/* Teléfono */}
                <div className="group">
                  <label className="flex items-center text-white font-medium mb-2">
                    <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                    Teléfono
                  </label>
                  <div className="relative">
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="1234567890"
                      className="w-full p-4 pl-12 border border-yellow-500/30 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 backdrop-blur-sm"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-400 mt-2 text-sm" />
                </div>
              </div>

              {/* Botón de envío mejorado */}
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
                      Invocando registro...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Unirse al Círculo Arcano
                      <Sparkles className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </button>
              </div>

              {/* Texto adicional */}
              <p className="text-center text-gray-400 text-sm mt-6">
                Al registrarte, aceptas formar parte de nuestro círculo místico
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default RegisterComponent
