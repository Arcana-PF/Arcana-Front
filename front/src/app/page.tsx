import Head from "next/head";
import "@/styles/global.css";
export default function Home() {
  return (
    <>
      <Head>
        <title>Mi Proyecto Next.js</title>
        <meta name="description" content="Página de inicio con diseño limpio y moderno" />
      </Head>
      
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <section className="text-center p-10">
          <h1 className="text-4xl font-bold text-gray-800">Bienvenido a mi sitio</h1>
          <p className="text-gray-600 mt-4">Explora nuestras funciones y descubre más.</p>
        </section>
      </main>
    </>
  );
}