"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Sparkles, Gift, Clock, X, Star, Zap } from "lucide-react"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80"

const offerData = {
  id: "eclipse-winter-2025",
  title: "Oferta de Eclipse Lunar",
  subtitle: "Energías cósmicas a tu alcance",
  discount: "50% OFF",
  category: "Kit Esotérico Premium",
  imageUrl: "https://i.pinimg.com/736x/3b/68/a5/3b68a5081da0059b9cb4d8c54b7521b7.jpg",
  validFor: 24,
  redirectTo: "/products?category=specials",
  features: [
    "Velas de cera de abeja",
    "Sahumerios naturales",
    "Cristales cargados lunarmente",
    "Guía de rituales incluida",
  ],
}

export const SeasonalOffer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(offerData.validFor)
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    if (typeof window === "undefined") return

    // Para test, que salga a cada rato
    localStorage.removeItem(`offer-${offerData.id}`)

    const today = new Date().toDateString()
    const lastShown = localStorage.getItem(`offer-${offerData.id}`)
    const wasClosed = sessionStorage.getItem(`offer-${offerData.id}-closed`)

    if (!lastShown || (lastShown !== today && !wasClosed)) {
      const showTimer = setTimeout(() => setIsVisible(true), 2000)

      const countdownInterval = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1))
      }, 3600000)

      return () => {
        clearTimeout(showTimer)
        clearInterval(countdownInterval)
      }
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(`offer-${offerData.id}`, new Date().toDateString())
    sessionStorage.setItem(`offer-${offerData.id}-closed`, "true")
  }

  const handleAccept = () => {
    setIsVisible(false)
    localStorage.setItem(`offer-${offerData.id}`, new Date().toDateString())
    window.location.href = offerData.redirectTo
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" 
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 cursor-pointer"
          aria-label="Cerrar oferta"
        >
          <X className="w-5 h-5 text-gray-300 hover:text-white" />
        </button>

        {/* Image section */}
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-purple-900/20 to-transparent z-[1]" />
          
          <div className="relative w-full h-full">
            <Image
              src={imageStatus === 'error' ? FALLBACK_IMAGE : offerData.imageUrl}
              alt={offerData.title}
              fill
              className={`object-cover transition-opacity duration-500 ${
                imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => setImageStatus('loaded')}
              onError={() => setImageStatus('error')}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Loading state */}
          {imageStatus !== 'loaded' && (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-500/30 animate-pulse" />
            </div>
          )}

          {/* Decorative elements */}
          <Sparkles className="absolute top-4 left-4 w-5 h-5 text-yellow-400 animate-spin-slow" />
          <Star className="absolute top-6 right-16 w-4 h-4 text-yellow-300 animate-pulse" />

          {/* Discount badge */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-3 py-1 rounded-full flex items-center shadow-lg z-10">
            <Zap className="w-4 h-4 mr-1" />
            {offerData.discount}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{offerData.title}</h2>
            <p className="text-purple-300 text-sm mt-1">{offerData.subtitle}</p>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {offerData.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-amber-400 bg-amber-500/10 rounded-lg p-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Oferta válida por <span className="font-medium">{timeLeft} horas</span>
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAccept}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
            >
              <Gift className="w-5 h-5" />
              <span className="font-semibold cursor-pointer">Aprovechar Oferta</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full text-gray-400 hover:text-white text-sm py-1 transition-colors duration-200 cursor-pointer"
            >
              Continuar explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}