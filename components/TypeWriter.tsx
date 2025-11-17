'use client'

import { useState, useEffect } from 'react'

interface TypewriterProps {
  text: string
  speed?: number // Velocità di scrittura (ms)
  delay?: number // Ritardo iniziale (ms)
  cursorDelay?: number // Quanto tempo il cursore resta dopo aver finito (ms)
  className?: string
}

export const Typewriter = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  cursorDelay = 1500, // Default: sparisce dopo 1.5 secondi
  className = "" 
}: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // 1. Gestione del ritardo iniziale
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  // 2. Gestione della scrittura
  useEffect(() => {
    if (!isStarted) return

    // Resettiamo il testo per sicurezza
    setDisplayedText('') 

    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        // Aggiungiamo la lettera corrente
        // Usiamo charAt per essere sicuri di prendere l'indice giusto
        const char = text.charAt(index)
        setDisplayedText((prev) => prev + char)
        index++
      } else {
        // Scrittura finita
        clearInterval(interval)
        
        // 3. Facciamo sparire il cursore dopo un po'
        setTimeout(() => {
          setShowCursor(false)
        }, cursorDelay)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, isStarted, cursorDelay])

  return (
    <span className={className}>
      {displayedText}
      {/* Il cursore viene mostrato solo se showCursor è true */}
      <span 
        className={`text-primary transition-opacity duration-500 ${
          showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`}
      >
        |
      </span>
    </span>
  )
}