import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Package, Shield, Truck, RotateCcw } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Kit Arduino Uno R3 + Sensores",
    description: "Kit completo para iniciación en mecatrónica: Arduino Uno R3, protoboard, cables, LEDs, resistencias, sensores de temperatura, ultrasónico y más.",
    price: 189,
    originalPrice: 229,
    image: "/img/kit-arduino.webp",
    category: "Kits",
    badge: "Más vendido",
    inStock: true,
  },
  {
    id: 2,
    name: "Raspberry Pi 4 Model B 8GB",
    description: "Computadora de placa única ideal para proyectos de robótica, IoT y automatización. Incluye disipador y ventilador.",
    price: 459,
    originalPrice: 499,
    image: "/img/raspberry-pi.webp",
    category: "Microcontroladores",
    badge: "Nuevo",
    inStock: true,
  },
  {
    id: 3,
    name: "Kit Brazo Robótico 4DOF",
    description: "Brazo robótico de 4 grados de libertad con servos MG996R, controlable via Arduino/Raspberry Pi. Ideal para aprendizaje de cinemática.",
    price: 329,
    originalPrice: 379,
    image: "/img/brazo-robotico.webp",
    category: "Robótica",
    badge: "Oferta",
    inStock: true,
  },
  {
    id: 4,
    name: "Sensor Pack 37 en 1",
    description: "Colección completa de sensores: temperatura, humedad, movimiento, luz, sonido, RFID, joystick y más. Compatible con Arduino/ESP32.",
    price: 149,
    originalPrice: 179,
    image: "/img/sensor-pack.webp",
    category: "Sensores",
    badge: "Popular",
    inStock: true,
  },
  {
    id: 5,
    name: "Impresora 3D Creality Ender 3 V3",
    description: "Impresora 3D FDM de alta precisión, volumen 220x220x250mm, extrusora directa, auto-nivelación. Ideal para prototipos mecánicos.",
    price: 1299,
    originalPrice: 1499,
    image: "/img/impresora-3d.webp",
    category: "Fabricación",
    badge: "Premium",
    inStock: true,
  },
  {
    id: 6,
    name: "Multímetro Digital Fluke 117",
    description: "Multímetro True-RMS profesional para mediciones eléctricas precisas. Voltaje AC/DC, corriente, resistencia, capacitancia, frecuencia.",
    price: 899,
    originalPrice: 999,
    image: "/img/multimetro.webp",
    category: "Instrumentos",
    badge: "Profesional",
    inStock: false,
  },
  {
    id: 7,
    name: "Kit Soldadura Profesional",
    description: "Estación de soldadura 90W con control de temperatura, punta intercambiable, soporte, estaño 63/37, bomba desoldadora y accesorios.",
    price: 279,
    originalPrice: 319,
    image: "/img/kit-soldadura.webp",
    category: "Herramientas",
    badge: "Esencial",
    inStock: true,
  },
  {
    id: 8,
    name: "ESP32 DevKit V1 + Cámara OV2640",
    description: "Microcontrolador WiFi/Bluetooth dual core con cámara 2MP. Ideal para visión artificial, IoT y proyectos de reconocimiento facial.",
    price: 129,
    originalPrice: 159,
    image: "/img/esp32-cam.webp",
    category: "Microcontroladores",
    badge: "IoT Ready",
    inStock: true,
  },
];

const categories = ["Todos", "Kits", "Microcontroladores", "Robótica", "Sensores", "Fabricación", "Instrumentos", "Herramientas"];

const benefits = [
  { icon: Truck, title: "Envío gratis", desc: "En pedidos mayores a S/ 500" },
  { icon: Shield, title: "Garantía 1 año", desc: "En todos los productos" },
  { icon: RotateCcw, title: "Devolución 30 días", desc: "Si no estás satisfecho" },
  { icon: Package, title: "Soporte técnico", desc: "Asesoría en tus proyectos" },
];

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 text-white py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('/img/pattern-grid.svg')] opacity-5" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-100">Tienda EDUKATECH</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Componentes para tus
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                proyectos mecatrónicos
              </span>
            </h1>
            <p className="mt-6 text-lg text-orange-100 max-w-2xl">
              Encuentra todo lo que necesitas para dar vida a tus proyectos: microcontroladores, sensores, kits, herramientas y más.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#productos"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-orange-600 shadow-lg transition hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ver productos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="#categorias"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ver categorías
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Categorías</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-950 sm:text-4xl">
              Compra por categoría
            </h2>
            <p className="mt-3 text-neutral-600">
              Encuentra rápidamente lo que necesitas para tu proyecto
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Categorías de productos">
            {categories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={category === "Todos"}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === "Todos"
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                    : "bg-neutral-100 text-neutral-700 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="productos" className="py-12 sm:py-16 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Productos Destacados</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-950 sm:text-4xl">
              Nuestros productos
            </h2>
            <p className="mt-3 text-neutral-600">
              Seleccionados cuidadosamente para makers, estudiantes y profesionales
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-orange-600 px-2.5 py-1 text-[10px] font-bold text-white">
                      {product.badge}
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-neutral-950 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-neutral-950">
                        S/ {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm line-through text-neutral-400">
                          S/ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      disabled={!product.inStock}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        product.inStock
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      }`}
                    >
                      {product.inStock ? (
                        <>
                          <ShoppingCart className="size-4 mr-1" aria-hidden="true" />
                          Añadir
                        </>
                      ) : (
                        "Agotado"
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/tienda/todos"
              className="inline-flex items-center gap-2 rounded-full border-2 border-orange-600 px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Ver todos los productos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-orange-600/20">
                  <benefit.icon className="size-7 text-orange-400" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="mt-1 text-neutral-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="mt-4 text-orange-100">
            Contáctanos y te ayudaremos a encontrar el componente perfecto para tu proyecto.
          </p>
          <Link
            href="/#contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-orange-600 shadow-lg transition hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contactar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}