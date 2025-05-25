"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation" 

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const router = useRouter() 
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black flex items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-4xl font-extrabold text-yellow-600">Arcana</h1>
            <Sparkles className="w-8 h-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-gray-300 text-sm">Accede a tu círculo místico</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors: { email?: string; password?: string } = {}
            if (!values.email) errors.email = "El email es requerido"
            if (!values.password) errors.password = "La contraseña es requerida"
            return errors
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await new Promise((res) => setTimeout(res, 1000))

            const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

            if (
              storedUser.email === values.email &&
              storedUser.password === values.password
            ) {
              login({
                id: 1,
                name: storedUser.name,
                email: storedUser.email,
              })
              alert("¡Login exitoso!")
              router.push("/") // 
            } else {
              alert("Credenciales incorrectas")
            }

            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
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

              {/* Contraseña */}
              <div className="group">
                <label className="flex items-center text-white font-medium mb-2">
                  <Lock className="w-4 h-4 mr-2 text-yellow-500" />
                  Contraseña
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Tu contraseña"
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

              {/* Botón de login */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                    isSubmitting
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Ingresando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Ingresar al Círculo Arcano
                      <Sparkles className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default LoginComponent
