import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SeasonalOffer } from "@/components/Notification/SeasonOff";



const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arcana Front",
  description: "Explora el mundo místico con nuestra tienda especializada.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen flex flex-col items-center justify-center antialiased`}>
        <CartProvider>
        <AuthProvider>  
        <NavBar />
        <SeasonalOffer />
        {children}
        <Footer />
        </AuthProvider>
        </CartProvider>
      </body>
      
    </html>
  );
}