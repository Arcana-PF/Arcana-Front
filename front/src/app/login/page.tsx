"use client"

import React from 'react';
import LoginComponent from '@/components/Login/LoginComponent';
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const Login = () => {

    const { userData } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userData) {
      router.replace("/") // redirige al home si ya está logueado
    }
  }, [userData, router])

  if (userData) {
    return null 
  }
    return(
    <div className="min-h-screen w-full">
        <LoginComponent />
    </div>
    )
}

export default Login