"use client";
import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

const Auth0ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain="dev-xxxxx.us.auth0.com"
      clientId="abc123..."
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
        audience: "https://arcana-back.onrender.com/",
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWrapper;