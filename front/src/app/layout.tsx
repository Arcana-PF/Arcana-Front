import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SeasonalOffer } from "@/components/Notification/SeasonOff";
import { Inter } from 'next/font/google';
import ChatBotComponent from "@/components/Chatbot/ChatbotComponent";
import Auth0ProviderWrapper from "./providers/AuthProviderWrapper";

const inter = Inter({ subsets: ['latin'] });

//const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
//const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arcana Front",
  description: "Explora el mundo místico con nuestra tienda especializada.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen flex flex-col items-center justify-center antialiased`}>
        <Auth0ProviderWrapper>
        <AuthProvider>  {/* ✅ Primero autenticación */}
          <CartProvider> {/* ✅ Luego el carrito, que puede depender del usuario */}
            <NavBar />
            <SeasonalOffer />
            {children}
            <ChatBotComponent />
            <Footer />
          </CartProvider>
        </AuthProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}