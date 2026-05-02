'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart, ChevronDown, Users, Stethoscope, Activity } from 'lucide-react'

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = Date.now()
          const step = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
            else setCount(target)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.1, 0.25, 0.1],
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(20, 184, 166, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(20, 184, 166, 0.03) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(255,255,255,0.01) 100px, rgba(255,255,255,0.01) 101px), repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.01) 100px, rgba(255,255,255,0.01) 101px)',
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <FloatingShape
        className="top-[15%] left-[10%] w-32 h-32 rounded-full border border-teal-500/10 bg-teal-500/5"
        delay={0}
      />
      <FloatingShape
        className="top-[25%] right-[15%] w-24 h-24 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 rotate-45"
        delay={1}
      />
      <FloatingShape
        className="bottom-[20%] left-[20%] w-16 h-16 rounded-full border border-teal-400/10 bg-teal-400/5"
        delay={2}
      />
      <FloatingShape
        className="top-[60%] right-[10%] w-20 h-20 rounded-lg border border-emerald-400/10 bg-emerald-400/5 -rotate-12"
        delay={0.5}
      />
      <FloatingShape
        className="bottom-[30%] right-[25%] w-40 h-40 rounded-full border border-teal-500/5"
        delay={1.5}
      />
      <FloatingShape
        className="top-[10%] right-[40%] w-12 h-12 rounded-full bg-teal-500/10"
        delay={3}
      />

      {/* Decorative dots */}
      <div className="absolute top-[30%] left-[30%] w-2 h-2 rounded-full bg-teal-400/20" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }} />
      <div className="absolute top-[50%] right-[30%] w-1.5 h-1.5 rounded-full bg-emerald-400/20" style={{ animation: 'pulse-glow 3s ease-in-out infinite 1s' }} />
      <div className="absolute bottom-[40%] left-[40%] w-2.5 h-2.5 rounded-full bg-teal-400/15" style={{ animation: 'pulse-glow 3s ease-in-out infinite 2s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="relative">
              <Heart className="h-5 w-5 text-teal-400" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-5 w-5 text-teal-400 opacity-30" />
              </motion.div>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Jano<span className="text-teal-400">.Health</span>
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Improving Chronic Care
            <br />
            <span className="gradient-text-teal">Retention & Outcomes</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          A data-driven consulting engagement analyzing patient behavior,
          predicting drop-off risk, and recommending evidence-based interventions
        </motion.p>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20">
            AS
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Ansh Sharma</p>
            <p className="text-xs text-slate-500">Healthcare Analytics Consultant</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto mb-16"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-4 w-4 text-teal-400/60 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                <AnimatedCounter target={2000} />
              </span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Patients</span>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="flex items-center justify-center mb-2">
              <Stethoscope className="h-4 w-4 text-emerald-400/60 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                <AnimatedCounter target={25} />
              </span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Doctors</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-4 w-4 text-teal-400/60 mr-1.5" />
              <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                <AnimatedCounter target={5992} />
              </span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Interactions</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-600 mb-3">Scroll to Explore</span>
          <div className="relative">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="h-5 w-5 text-teal-400/50" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  )
}
