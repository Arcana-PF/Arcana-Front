import CardList from "@/components/CardList";
import ComponentSlider from "@/components/Slider/SliderComponent";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black text-white overflow-x-hidden">
  {/* Slider en pantalla completa */}
  <section>
    <ComponentSlider />
  </section>

  {/* Separador */}
  <div className="h-10" />

  {/* Contenido más centrado */}
  <section className="max-w-screen-xl mx-auto px-4">
    <CardList />
  </section>
</main>

  );
}

