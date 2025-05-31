"use client"
import { IUserSession } from "@/types"
import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import Cookies from "js-cookie"

export interface AuthContextProps {
  userData: IUserSession | null
  setUserData: (userData: IUserSession | null) => void,
}

export const AuthContext = createContext<AuthContextProps>({
  userData: null,
  setUserData: () => {}
})

export interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null)

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userSession", JSON.stringify({token: userData.token, user: userData.user}))
      Cookies.set("userSession", JSON.stringify({token: userData.token, user: userData.user}))
    }
  }, [userData])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userSession")!)
    setUserData(userData)
  }, [])

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider")
  return context
}
