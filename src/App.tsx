import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useEmblaCarousel from 'embla-carousel-react';
import { FaWhatsapp } from 'react-icons/fa';
import {
  Menu, X, ChevronDown, CheckCircle2,
  ShieldCheck, Sparkles, Palette, Leaf, Clock, TrendingUp,
  ArrowRight, Layers, Beaker, Factory, PenTool, Wrench, Sofa, Megaphone, Package,
  ZoomIn, ChevronLeft, ChevronRight,
  Award, Maximize, Truck, FileText, CreditCard, Box, MapPin, Phone, Mail,
  Star, Quote,
  Facebook, Instagram, Linkedin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const navLinks = [
  { name: 'Sobre', id: 'sobre' },
  { name: 'Serviços', id: 'servicos' },
  { name: 'Galeria', id: 'galeria' },
  { name: 'Diferenciais', id: 'diferenciais' },
  { name: 'Depoimentos', id: 'depoimentos' },
  { name: 'FAQ', id: 'faq' },
  { name: 'Contato', id: 'contato' },
];

function smoothScrollTo(targetY: number) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: targetY, behavior: prefersReduced ? 'auto' : 'smooth' });
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;
      const headerOffset = window.innerWidth >= 1024 ? 80 : 64;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        window.setTimeout(() => smoothScrollTo(targetY), 220);
      } else {
        smoothScrollTo(targetY);
      }
      if (history.replaceState) history.replaceState(null, '', `#${id}`);
    },
    [mobileMenuOpen],
  );

  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(0);
    if (history.replaceState) history.replaceState(null, '', ' ');
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-sm border-b border-gray-200 py-3' : 'border-b border-gray-100 py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        <a
          href="#"
          onClick={handleLogoClick}
          className="flex items-center gap-3 text-2xl md:text-3xl font-display font-bold text-blue-950 tracking-wider shrink-0"
        >
          <img src="/logo_azul.webp" alt="Logo Staticolor" className="h-8 md:h-10 w-auto object-contain" />
          STATICOLOR
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.name}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${isActive
                      ? 'text-[var(--staticolor-accent)]'
                      : 'text-[var(--staticolor-gray-600)] hover:text-[var(--staticolor-primary)]'
                      }`}
                  >
                    {link.name}
                    <motion.span
                      className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-[var(--staticolor-accent)] rounded-full origin-left"
                      initial={false}
                      animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <Button
            asChild
            className="bg-[var(--staticolor-accent)] hover:bg-blue-700 text-white border-none transition-transform hover:scale-[1.03]"
          >
            <a href="#contato" onClick={(e) => handleNavClick(e, 'contato')}>
              Solicitar Orçamento
            </a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[var(--staticolor-primary)] p-2 shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileMenuOpen}
        >
          <motion.div
            initial={false}
            animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
              <ul className="flex flex-col px-4 py-6 gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className={`block text-lg font-medium px-3 py-3 rounded-md transition-colors ${activeSection === link.id
                        ? 'text-[var(--staticolor-accent)] bg-blue-50'
                        : 'text-[var(--staticolor-gray-600)] hover:bg-gray-50 hover:text-[var(--staticolor-primary)]'
                        }`}
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + navLinks.length * 0.04, duration: 0.3 }}
                  className="pt-4 border-t border-gray-100 mt-2"
                >
                  <Button
                    asChild
                    className="w-full bg-[var(--staticolor-accent)] hover:bg-blue-700 text-white"
                  >
                    <a href="#contato" onClick={(e) => handleNavClick(e, 'contato')}>
                      Solicitar Orçamento
                    </a>
                  </Button>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = 121;
  const currentFrame = (index: number) => `/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`;

  useEffect(() => {
    // Pré-carrega todas as imagens para a RAM
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxCanvas = canvas.getContext('2d');
    if (!ctxCanvas) return;

    const render = (index: number) => {
      const img = images[index];
      if (img && img.complete && img.naturalWidth > 0) {
        if (canvas.width !== img.naturalWidth) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
        ctxCanvas.drawImage(img, 0, 0);
      }
    };

    // Renderiza a primeira imagem assim que carregar
    images[0].onload = () => render(0);
    // Também tenta renderizar de imediato, caso já esteja no cache do navegador
    render(0);

    const ctx = gsap.context(() => {
      let frameId: number;

      const updateFrame = (self: ScrollTrigger) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(self.progress * frameCount))
        );
        if (frameId) cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => render(frameIndex));
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80px',
        end: 'bottom center',
        scrub: true,
        onUpdate: updateFrame,
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-0 lg:min-h-[100dvh] bg-white flex flex-col justify-start lg:justify-center overflow-hidden pt-28 lg:pt-20 pb-12 lg:pb-12">
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full">

          {/* CONTEÚDO DE TEXTO */}
          <div className="w-full lg:w-[55%] max-w-3xl shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--staticolor-primary)] text-sm font-medium mb-6 mt-2 lg:mt-0">
                <CheckCircle2 className="w-4 h-4 text-[var(--staticolor-whatsapp)]" />
                <span>Atendimento em até 2h</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2rem,4vw,4.25rem)] leading-[1.05] font-display font-bold text-[var(--staticolor-primary)] mb-6 tracking-tight"
            >
              Pintura Eletrostática que{' '}
              <span className="bg-gradient-to-r from-[var(--staticolor-primary)] to-[var(--staticolor-accent)] bg-clip-text text-transparent">
                Protege, Valoriza
              </span>{' '}
              e Dura.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-lg lg:text-xl text-[var(--staticolor-gray-600)] mb-8 lg:mb-10 max-w-2xl leading-relaxed"
            >
              Acabamento profissional para peças metálicas com alta durabilidade, agilidade na entrega e atendimento personalizado para indústrias, serralherias e fabricantes em Uberlândia/MG.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base bg-[var(--staticolor-accent)] hover:bg-blue-700 text-white font-medium hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
              >
                <a href="#contato">Solicite seu Orçamento</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-[var(--staticolor-primary)] text-[var(--staticolor-primary)] hover:bg-[var(--staticolor-primary)] hover:text-white font-medium hover:scale-[1.03] transition-all duration-300"
              >
                <a
                  href="https://wa.me/5534992179828?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20pintura%20eletrost%C3%A1tica."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="mr-2 text-xl text-[var(--staticolor-whatsapp)]" /> Fale no WhatsApp
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex mt-12 pt-8 border-t border-[var(--staticolor-gray-200)] flex-wrap items-center gap-x-8 gap-y-3 text-[var(--staticolor-gray-500)] text-sm"
            >
              {['Garantia pós-venda', 'Estufa de 6 metros', 'Tanque 6.000L Kualipthos 605B', 'Triângulo Mineiro'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--staticolor-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* VÍDEO COM SCROLL SCRUBBING */}
          <div className="w-full lg:w-[45%] flex justify-center items-center mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-xl mx-auto overflow-hidden bg-transparent flex justify-center items-center"
            >
              <canvas
                ref={canvasRef}
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────

function AnimatedCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();
    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    requestAnimationFrame(updateCounter);
  }, [isInView, value]);

  return (
    <div ref={ref} className="p-6 bg-white border border-[var(--staticolor-gray-200)] rounded-lg shadow-sm">
      <div className="text-4xl md:text-5xl font-display font-bold text-[var(--staticolor-primary)] mb-2">
        {count.toLocaleString('pt-BR')}{suffix}
      </div>
      <div className="text-sm font-medium text-[var(--staticolor-gray-600)] uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="sobre" className="relative py-20 md:py-32 bg-[var(--staticolor-off-white)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[3px] w-16 bg-[var(--staticolor-accent)] mb-6 origin-left rounded-full"
            />
            <div className="inline-block text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">
              Sobre a Staticolor
            </div>
            <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-6 leading-tight">
              Especialistas em Pintura Eletrostática no Triângulo Mineiro
            </h2>
            <div className="space-y-4 text-[var(--staticolor-gray-600)] text-lg leading-relaxed">
              <p>
                Localizada em Uberlândia/MG, a Staticolor é referência em acabamento premium para peças metálicas. Atendemos com excelência serralherias, indústrias metalúrgicas, fabricantes de móveis metálicos e empresas de comunicação visual.
              </p>
              <p>
                Nossa estrutura foi projetada para lidar com a demanda industrial real. Contamos com cabines individuais para diferentes cores, garantindo agilidade e evitando contaminação, além de uma estufa de alta capacidade que acomoda peças de grande porte.
              </p>
              <p>
                O grande diferencial do nosso processo começa antes mesmo da pintura: utilizamos um tanque de 6.000 litros para tratamento químico de imersão com Kualipthos 605B. Esta etapa de decapagem e fosfatização é fundamental para garantir a máxima aderência e proteção contra corrosão.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            <AnimatedCounter value={6} suffix="m" label="Estufa de alta capacidade" />
            <AnimatedCounter value={6000} suffix="L" label="Tanque de tratamento químico" />
            <AnimatedCounter value={3} label="Cabines individuais de pintura" />
            <div className="p-6 bg-[var(--staticolor-primary)] text-white rounded-lg shadow-sm flex flex-col justify-center">
              <div className="text-2xl font-display font-bold mb-2">Uberlândia/MG</div>
              <div className="text-sm font-medium text-blue-200 uppercase tracking-wide">
                Cobertura no Triângulo Mineiro
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// BENEFITS
// ─────────────────────────────────────────────

const benefits = [
  { title: 'Alta Durabilidade', description: 'Resistência superior a impactos, riscos, corrosão e intempéries comparado à pintura convencional.', icon: ShieldCheck },
  { title: 'Acabamento Premium', description: 'Superfície uniforme, sem escorrimentos ou irregularidades. Resultado impecável em todas as peças.', icon: Sparkles },
  { title: 'Ampla Variedade de Cores', description: 'Disponibilidade de toda a cartela RAL e acabamentos matte, brilhante, texturizado e metalizado.', icon: Palette },
  { title: 'Processo Ecológico', description: 'Tinta em pó sem solventes, sem emissão de VOCs. Processo sustentável com aproveitamento de até 95% do material.', icon: Leaf },
  { title: 'Agilidade na Entrega', description: 'Processo otimizado e estufa de alta capacidade garantem rapidez sem abrir mão da qualidade.', icon: Clock },
  { title: 'Custo-Benefício Superior', description: 'Menor desperdício de material, maior vida útil das peças e redução de retrabalho.', icon: TrendingUp },
];

function Benefits() {
  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">Benefícios</div>
          <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">
            Por que Pintura Eletrostática?
          </h2>
          <p className="text-lg text-[var(--staticolor-gray-600)]">A tecnologia mais avançada para proteção e acabamento de metais.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 border border-[var(--staticolor-gray-200)] rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 text-[var(--staticolor-accent)] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[var(--staticolor-accent)] group-hover:text-white transition-colors">
                <benefit.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-display font-bold text-[var(--staticolor-primary)] mb-3">{benefit.title}</h3>
              <p className="text-[var(--staticolor-gray-600)] leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

const services = [
  { icon: Layers, title: 'Pintura Eletrostática a Pó', description: 'Aplicação profissional para peças metálicas de todos os portes com acabamento perfeito.' },
  { icon: Beaker, title: 'Tratamento Químico', description: 'Imersão em tanque de decapagem e fosfatização (Kualipthos 605B) garantindo máxima aderência.' },
  { icon: Factory, title: 'Lotes Industriais', description: 'Capacidade de produção em escala para indústrias e fabricantes com padronização rigorosa.' },
  { icon: PenTool, title: 'Peças Sob Demanda', description: 'Pintura personalizada para protótipos e unidades individuais, sem exigência de quantidade mínima.' },
  { icon: Wrench, title: 'Atendimento a Serralherias', description: 'Parceria focada em agilidade e qualidade para portões, grades e estruturas metálicas.' },
  { icon: Sofa, title: 'Móveis Metálicos', description: 'Acabamento refinado para mobiliário corporativo, comercial e residencial.' },
  { icon: Megaphone, title: 'Comunicação Visual', description: 'Durabilidade para totens, painéis, letreiros e estruturas expostas ao tempo.' },
  { icon: Package, title: 'Embalagem e Logística', description: 'Proteção cuidadosa das peças finalizadas para garantir a entrega impecável.' },
];

function Services() {
  return (
    <section id="servicos" className="py-20 md:py-32 bg-[var(--staticolor-primary)] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">O que fazemos</div>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">Nossos Serviços</h2>
          <p className="text-lg text-blue-200">Soluções completas para peças metálicas de todos os portes.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[var(--staticolor-primary-mid)] border border-[var(--staticolor-primary-light)] p-6 rounded-xl flex flex-col h-full group hover:border-[var(--staticolor-accent)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-6 text-[var(--staticolor-accent)]">
                <service.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{service.title}</h3>
              <p className="text-blue-100/70 text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>
              <a
                href={`#contato?servico=${encodeURIComponent(service.title)}`}
                className="text-sm font-medium text-[var(--staticolor-accent)] hover:text-white inline-flex items-center gap-1 transition-colors mt-auto group-hover:underline"
              >
                Solicitar orçamento <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────

// Mapeamento automático para imagens da pasta src/assets
const assetImages = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}', { eager: true, import: 'default' }) as Record<string, string>;

function resolveGalleryImage(src: string): string {
  if (!src) return '';
  if (typeof src !== 'string') return src;

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  if (src.startsWith('/') && !src.startsWith('/src/')) {
    return src;
  }

  let normalized = src;
  if (normalized.startsWith('@/assets/')) {
    normalized = normalized.replace('@/assets/', '/src/assets/');
  } else if (normalized.startsWith('assets/')) {
    normalized = '/src/' + normalized;
  } else if (!normalized.startsWith('/src/assets/')) {
    normalized = '/src/assets/' + normalized.replace(/^\//, '');
  }

  return assetImages[normalized] || src;
}

const categories = ['Todos', /*'Estruturas Metálicas', 'Móveis', 'Comunicação Visual', 'Indústria',*/ 'Nossa Estrutura'];

/* 
  📌 GALERIA DE FOTOS - COMO ALTERAR OU ADICIONAR NOVAS FOTOS:
  Basta mudar a propriedade 'src' dos itens abaixo para a foto desejada.
  Formatos aceitos diretamente:
  - Nome do arquivo em src/assets: 'gallery-1.webp' ou 'ft1.webp'
  - Caminho relativo ou alias: '@/assets/ft1.webp' ou '/src/assets/ft1.webp'
  - Foto na pasta public: '/logo_azul.webp'
  - Link de imagem da web: 'https://exemplo.com/imagem.jpg'
*/
import ft1 from './assets/ft1.webp';
import ft2 from './assets/ft2.webp';
import ft5 from './assets/ft5.webp';
import ft6 from './assets/ft6.webp';
import ft10 from './assets/ft10.webp';
import ft11 from './assets/ft11.webp';
import ft12 from './assets/ft12.webp';
import ft16 from './assets/ft16.webp';
import ft18 from './assets/ft18.webp';
import ft21 from './assets/ft21.webp';
import ft22 from './assets/ft22.webp';
import ft23 from './assets/ft23.webp';
import ft28 from './assets/ft28.webp';
import ft33 from './assets/ft33.webp';

const galleryItems = [
  { id: 1, src: ft33, category: 'Estruturas Metálicas', title: '' },
  { id: 2, src: ft5, category: 'Indústria', title: '' },
  { id: 3, src: ft6, category: 'Móveis', title: '' },
  { id: 4, src: ft23, category: 'Comunicação Visual', title: '' },
  { id: 5, src: ft16, category: 'Estruturas Metálicas', title: '' },
  { id: 6, src: ft28, category: 'Indústria', title: '' },
  { id: 7, src: ft12, category: 'Móveis', title: '' },
  { id: 8, src: ft21, category: 'Comunicação Visual', title: '' },
  { id: 9, src: ft1, category: 'Nossa Estrutura', title: '' },
  { id: 10, src: ft2, category: 'Nossa Estrutura', title: '' },
  { id: 11, src: ft10, category: 'Nossa Estrutura', title: '' },
  { id: 12, src: ft11, category: 'Nossa Estrutura', title: '' },
  { id: 13, src: ft22, category: 'Nossa Estrutura', title: '' },
  { id: 14, src: ft18, category: 'Nossa Estrutura', title: '' },
];

function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = activeCategory === 'Todos'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);

  return (
    <section id="galeria" className="py-20 md:py-32 bg-[var(--staticolor-off-white)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">Galeria</div>
          <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">Nosso Trabalho</h2>
          <p className="text-lg text-[var(--staticolor-gray-600)]">Peças reais, resultado real.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                ? 'bg-[var(--staticolor-primary)] text-white'
                : 'bg-white text-[var(--staticolor-gray-600)] border border-[var(--staticolor-gray-200)] hover:border-[var(--staticolor-primary)]'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={resolveGalleryImage(item.src)}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[var(--staticolor-primary)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                  <ZoomIn size={32} className="mb-2" />
                  <span className="font-medium text-sm px-4 text-center">{item.title}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white hover:text-gray-300 z-50">
              <X size={32} />
            </button>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 p-2">
              <ChevronLeft size={48} />
            </button>
            <div className="relative w-full max-w-4xl px-12 aspect-[4/3] sm:aspect-auto sm:h-[80vh] flex items-center justify-center">
              <img
                src={resolveGalleryImage(filteredItems[currentIndex].src)}
                alt={filteredItems[currentIndex].title}
                className="max-w-full max-h-full object-contain rounded"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center text-white font-medium">
                {filteredItems[currentIndex].title}
              </div>
            </div>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 p-2">
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────────
// DIFFERENTIALS
// ─────────────────────────────────────────────

const differentials = [
  { title: 'GARANTIA PÓS-VENDA', description: 'Garantia contra desplacamento da tinta e oxidação. Nosso compromisso com a qualidade não termina na entrega.', icon: Award },
  { title: 'RIGOR TÉCNICO EM CADA ETAPA', description: 'Controle de qualidade em todas as fases: pré-tratamento, aplicação, cura e embalagem.', icon: CheckCircle2 },
  { title: 'ESTRUTURA PROFISSIONAL COMPLETA', description: 'Estufa de 6 metros | 3 cabines individuais | Tanque de 6.000L para tratamento de imersão Kualipthos 605B.', icon: Maximize },
  { title: 'PEÇAS DE TODOS OS PORTES', description: 'Capacidade para peças grandes, médias e pequenas — desde lotes industriais até unidades únicas.', icon: Box },
  { title: 'AGILIDADE NA ENTREGA', description: 'Processo otimizado para cumprir prazos sem comprometer o acabamento.', icon: Truck },
  { title: 'ORÇAMENTO PERSONALIZADO', description: 'Cada projeto recebe atenção individual. Sem tabela fechada — cotação feita para sua necessidade real.', icon: FileText },
  { title: 'CONDIÇÕES FLEXÍVEIS DE PAGAMENTO', description: 'Diversas formas de pagamento para facilitar sua operação.', icon: CreditCard },
  { title: 'EMBALAGEM CUIDADOSA', description: 'Peças embaladas com proteção adequada para chegarem perfeitas ao destino.', icon: Box },
  { title: 'ATUAÇÃO REGIONAL', description: 'Uberlândia/MG e toda a região do Triângulo Mineiro.', icon: MapPin },
];

function Differentials() {
  return (
    <section id="diferenciais" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">Diferenciais</div>
          <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">
            Por que escolher a Staticolor?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {differentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--staticolor-primary)] text-white flex items-center justify-center mt-1">
                <item.icon size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[var(--staticolor-primary)] tracking-wide mb-2">{item.title}</h3>
                <p className="text-[var(--staticolor-gray-600)] leading-relaxed text-sm md:text-base">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium italic border border-gray-200">
            <CheckCircle2 size={16} className="text-green-600" />
            emissão de nota fiscal — Trabalhamos com total transparência e regularidade fiscal.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PROCESS
// ─────────────────────────────────────────────

const steps = [
  { number: '1', title: 'RECEBIMENTO E AVALIAÇÃO', description: 'Recebemos suas peças e avaliamos o estado e as especificações para garantir o melhor tratamento.' },
  { number: '2', title: 'PRÉ-TRATAMENTO QUÍMICO', description: 'Imersão em tanque de 6.000L com produto Kualipthos 605B para decapagem e fosfatização — base para máxima aderência.' },
  { number: '3', title: 'CABINE DE PINTURA', description: 'Aplicação eletrostática em cabines individuais com controle preciso de dosagem e uniformidade.' },
  { number: '4', title: 'CURA EM ESTUFA', description: 'Polimerização em estufa de 6 metros a temperatura controlada para garantir resistência e durabilidade máximas.' },
  { number: '5', title: 'CONTROLE DE QUALIDADE E ENTREGA', description: 'Inspeção final, embalagem cuidadosa e entrega ou retirada da sua peça com acabamento impecável.' },
];

function Process() {
  return (
    <section className="py-20 md:py-32 bg-[var(--staticolor-primary)] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">Nosso Processo</div>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">Como Trabalhamos</h2>
          <p className="text-lg text-blue-200">Rigor técnico do início ao fim.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[27px] md:left-0 top-0 bottom-0 md:top-[27px] md:bottom-auto w-1 md:w-full h-full md:h-1 bg-[var(--staticolor-primary-light)] z-0 rounded-full" />
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex md:flex-col items-start md:items-center gap-6 md:gap-4 md:text-center w-full md:w-1/5"
              >
                <motion.div
                  initial={{ backgroundColor: 'var(--staticolor-primary-light)', borderColor: 'var(--staticolor-primary)' }}
                  whileInView={{ backgroundColor: 'var(--staticolor-accent)', borderColor: 'white' }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="flex-shrink-0 w-14 h-14 rounded-full border-4 flex items-center justify-center font-display font-bold text-xl relative z-10 transition-colors"
                >
                  {step.number}
                </motion.div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-blue-100/70 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────

const testimonials = [
  { quote: 'Desde que passamos a pintar nossas estruturas com a Staticolor, os chamados por oxidação despencaram a zero. O tratamento químico deles faz toda a diferença.', name: 'Carlos Eduardo', role: 'Proprietário de Serralheria' },
  { quote: 'A estufa de 6 metros deles salvou nosso projeto de comunicação visual. Ninguém na região conseguia pintar os totens inteiros sem emendas.', name: 'Mariana Costa', role: 'Engenheira de Produção' },
  { quote: 'Agilidade absurda. Mandamos lotes de cadeiras metálicas toda semana e o padrão de cor é sempre idêntico. Acabamento premium de verdade.', name: 'Roberto Alves', role: 'Gerente de Fábrica de Móveis' },
  { quote: 'Excelente atendimento B2B. Orçamentos rápidos, flexibilidade no pagamento e entrega das peças super bem embaladas. Parceiro estratégico.', name: 'Juliana Mendes', role: 'Compradora Industrial' },
  { quote: 'A durabilidade da pintura nas nossas peças expostas ao tempo é impressionante. O Kualipthos 605B realmente prepara a base melhor que a concorrência.', name: 'Fernando Silva', role: 'Diretor de Operações' },
];

function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section id="depoimentos" className="py-20 md:py-32 bg-[var(--staticolor-off-white)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">Depoimentos</div>
          <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">
            O que nossos clientes dizem
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_80%] lg:flex-[0_0_60%]">
                  <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[var(--staticolor-gray-200)] h-full mx-2 flex flex-col">
                    <div className="flex text-yellow-400 mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <Quote className="text-[var(--staticolor-gray-200)] w-12 h-12 mb-4 rotate-180" />
                    <p className="text-lg md:text-xl text-[var(--staticolor-gray-800)] font-medium leading-relaxed mb-8 flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <h4 className="font-bold text-[var(--staticolor-primary)]">{testimonial.name}</h4>
                      <p className="text-sm text-[var(--staticolor-gray-600)]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${index === selectedIndex ? 'bg-[var(--staticolor-accent)] w-8' : 'bg-[var(--staticolor-gray-400)]'
                  }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────

const faqs = [
  { question: 'Quais tipos de peças vocês pintam?', answer: 'Trabalhamos com peças metálicas de todos os portes — desde pequenas peças industriais até grandes estruturas metálicas. Atendemos serralherias, indústrias, fabricantes de móveis e comunicação visual.' },
  { question: 'Qual é o prazo de entrega?', answer: 'O prazo varia conforme o volume e complexidade do serviço. Solicite seu orçamento e informe suas necessidades — trabalhamos para atender sua demanda com agilidade.' },
  { question: 'Vocês oferecem garantia?', answer: 'Sim. Oferecemos garantia pós-venda contra desplacamento da tinta e oxidação das peças pintadas.' },
  { question: 'Quais cores estão disponíveis?', answer: 'Trabalhamos com toda a cartela RAL e diversas opções de acabamento: matte, brilhante, texturizado e metalizado.' },
  { question: 'O processo de pintura inclui pré-tratamento?', answer: 'Sim. Realizamos tratamento químico de imersão em tanque de 6.000 litros com produto Kualipthos 605B (decapagem e fosfatização) antes da pintura, garantindo máxima aderência e durabilidade.' },
  { question: 'Vocês atendem fora de Uberlândia?', answer: 'Sim, atendemos toda a região do Triângulo Mineiro. Entre em contato para verificar a logística.' },
  { question: 'Como funciona o orçamento?', answer: 'O orçamento é personalizado e gratuito. Preencha nosso formulário ou fale diretamente pelo WhatsApp com informações sobre suas peças, quantidade e cor desejada.' },
  { question: 'Vocês emitem Nota Fiscal?', answer: 'Sim, todos os nossos serviços são acompanhados de emissão de nota fiscal.' },
  {
    question: 'Qual catálogo de cores?',
    answer: (
      <>
        As paletas de cores que utilizamos podem ser acessadas pelo link a seguir:{' '}
        <a
          href="/catalogocores.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--staticolor-accent)] font-semibold hover:underline"
        >
          CLIQUE AQUI
        </a>
      </>
    ),
  },
];

function Faq() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">FAQ</div>
          <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">Dúvidas Frequentes</h2>
          <p className="text-lg text-[var(--staticolor-gray-600)]">Respostas para as perguntas mais comuns dos nossos clientes.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-[var(--staticolor-gray-200)] rounded-xl bg-white shadow-[0_2px_8px_rgba(10,22,40,0.04)] hover:shadow-[0_8px_24px_rgba(10,22,40,0.08)] hover:border-[var(--staticolor-accent)]/40 transition-all duration-300 data-[state=open]:shadow-[0_12px_32px_rgba(37,99,235,0.12)] data-[state=open]:border-[var(--staticolor-accent)]/50"
              >
                <AccordionTrigger className="text-left font-medium text-base md:text-lg text-[var(--staticolor-primary)] hover:text-[var(--staticolor-accent)] hover:no-underline px-6 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[var(--staticolor-gray-600)] text-base leading-relaxed px-6 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

const formSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  telefone: z.string().min(10, 'Telefone/WhatsApp é obrigatório'),
  tipoPeca: z.string().min(2, 'Tipo de peça é obrigatório'),
  quantidade: z.string().min(1, 'Quantidade é obrigatória'),
  cor: z.string().optional(),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  observacoes: z.string().optional(),
  lgpd: z.boolean().refine((val) => val === true, { message: 'Você deve aceitar a política de privacidade' }),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function Contact() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', telefone: '', tipoPeca: '', quantidade: '', cor: '', cidade: '', observacoes: '', lgpd: false, website: '' },
  });

  const onSubmit = (data: FormValues) => {
    if (data.website) return;
    const text = `*Orçamento de Pintura Eletrostática*
    
*Nome/Empresa:* ${data.nome}
*Tipo de Peça:* ${data.tipoPeca}
*Quantidade:* ${data.quantidade}
*Cor Desejada:* ${data.cor || 'Não especificada'}
*Cidade:* ${data.cidade}
*Observações:* ${data.observacoes || 'Nenhuma'}

Aguardo retorno!`;
    window.open(`https://wa.me/5534992179828?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contato" className="py-20 md:py-32 bg-[var(--staticolor-off-white)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[3px] w-16 bg-[var(--staticolor-accent)] mx-auto mb-6 rounded-full"
          />
          <div className="text-xs font-semibold tracking-[0.3em] text-[var(--staticolor-accent)] uppercase mb-4">Contato</div>
          <h2 className="text-[var(--staticolor-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold mb-4">Solicite seu Orçamento</h2>
          <p className="text-lg text-[var(--staticolor-gray-600)]">Preencha o formulário abaixo e entraremos em contato em até 2 horas.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--staticolor-gray-200)]"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="hidden">
                  <FormField control={form.control} name="website" render={({ field }) => <Input {...field} tabIndex={-1} autoComplete="off" />} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome / Empresa *</FormLabel>
                      <FormControl><Input placeholder="Sua empresa" {...field} className={form.formState.errors.nome ? 'border-red-500' : form.formState.dirtyFields.nome ? 'border-green-500' : ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="telefone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp *</FormLabel>
                      <FormControl><Input placeholder="(34) 99217-9828" {...field} className={form.formState.errors.telefone ? 'border-red-500' : form.formState.dirtyFields.telefone ? 'border-green-500' : ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="tipoPeca" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de peça *</FormLabel>
                      <FormControl><Input placeholder="Ex: Estrutura de mesa, Portão..." {...field} className={form.formState.errors.tipoPeca ? 'border-red-500' : form.formState.dirtyFields.tipoPeca ? 'border-green-500' : ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="quantidade" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade aproximada *</FormLabel>
                      <FormControl><Input placeholder="Ex: 50 unidades, 2 lotes..." {...field} className={form.formState.errors.quantidade ? 'border-red-500' : form.formState.dirtyFields.quantidade ? 'border-green-500' : ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="cor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor desejada</FormLabel>
                      <FormControl><Input placeholder="Ex: Preto fosco, RAL 5011" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="cidade" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl><Input placeholder="Sua cidade" {...field} className={form.formState.errors.cidade ? 'border-red-500' : form.formState.dirtyFields.cidade ? 'border-green-500' : ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="observacoes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl><Textarea placeholder="Detalhes adicionais, estado das peças..." className="resize-none h-24" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="lgpd" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm text-[var(--staticolor-gray-600)] cursor-pointer">
                        Concordo em fornecer meus dados para que a Staticolor entre em contato referente a este orçamento.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />

                <Button type="submit" size="lg" className="w-full h-14 text-base bg-[var(--staticolor-accent)] hover:bg-blue-700 text-white">
                  Solicitar Cotação Rápida <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 h-full"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--staticolor-gray-200)] space-y-6">
              <h3 className="font-display font-bold text-2xl text-[var(--staticolor-primary)] mb-2">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-[var(--staticolor-gray-600)]">
                  <MapPin className="text-[var(--staticolor-accent)] flex-shrink-0 mt-1" />
                  <div><strong className="block text-[var(--staticolor-primary)]">Endereço</strong>Av. André Rebouças, 265 - Nossa Sra. das Graças<br />Uberlândia - MG, 38402-002</div>
                </div>
                <div className="flex items-start gap-4 text-[var(--staticolor-gray-600)]">
                  <Phone className="text-[var(--staticolor-accent)] flex-shrink-0 mt-1" />
                  <div><strong className="block text-[var(--staticolor-primary)]">WhatsApp / Telefone</strong>(34) 99217-9828</div>
                </div>
                <div className="flex items-start gap-4 text-[var(--staticolor-gray-600)]">
                  <Mail className="text-[var(--staticolor-accent)] flex-shrink-0 mt-1" />
                  <div><strong className="block text-[var(--staticolor-primary)]">E-mail</strong>contato@staticolorpintura.com.br</div>
                </div>
                <div className="flex items-start gap-4 text-[var(--staticolor-gray-600)]">
                  <Clock className="text-[var(--staticolor-accent)] flex-shrink-0 mt-1" />
                  <div><strong className="block text-[var(--staticolor-primary)]">Horário de Funcionamento</strong>Segunda a Sexta: 08h às 18h<br />Sábado: 08h às 12h</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[var(--staticolor-gray-200)] w-full min-h-[300px] flex-1 flex flex-col">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.3111107293967!2d-48.27775200000001!3d-18.8732745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a4470050d8ba97%3A0xb781231564dbfd60!2sStaticolor%20-%20Pintura%20Eletroest%C3%A1tica!5e0!3m2!1spt-BR!2sbr!4v1777764862350!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                className="flex-1"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Uberlândia"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[var(--staticolor-primary)] text-white pt-20 pb-8 border-t border-[var(--staticolor-primary-light)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-3xl font-display font-bold tracking-wider">
              <img src="/logo.webp" alt="Logo Staticolor" className="h-10 w-auto object-contain" />
              STATICOLOR
            </div>
            <p className="text-blue-100/70 text-sm leading-relaxed max-w-xs">
              Pintura eletrostática profissional para peças metálicas. Qualidade, durabilidade e agilidade para o setor industrial e de serviços do Triângulo Mineiro.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/staticolorpintura/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--staticolor-accent)] transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--staticolor-accent)] transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--staticolor-accent)] transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-blue-100/70">
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#servicos" className="hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#galeria" className="hover:text-white transition-colors">Galeria de Projetos</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition-colors">Nossos Diferenciais</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Serviços</h4>
            <ul className="space-y-3 text-blue-100/70">
              <li>Pintura Eletrostática a Pó</li>
              <li>Pré-tratamento Químico</li>
              <li>Pintura de Lotes Industriais</li>
              <li>Peças Sob Demanda</li>
              <li>Atendimento a Serralherias</li>
              <li>Pintura para Comunicação Visual</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Contato</h4>
            <ul className="space-y-4 text-blue-100/70 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-[var(--staticolor-accent)] flex-shrink-0" />
                <span>Av. André Rebouças, 265 - Nossa Sra. das Graças<br />Uberlândia - MG, 38402-002</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--staticolor-accent)] flex-shrink-0" />
                <span>(34) 99217-9828</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-[var(--staticolor-accent)] flex-shrink-0" />
                <span className="break-all">contato@staticolorpintura.com.br</span>
              </li>
            </ul>
            <Button asChild className="w-full bg-[var(--staticolor-accent)] hover:bg-blue-700 text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
              <a href="#contato">Solicitar Orçamento</a>
            </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-100/50">
          <div>© {currentYear} Staticolor Pintura Eletrostática. Todos os direitos reservados.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// WHATSAPP FLOAT
// ─────────────────────────────────────────────

function WhatsappFloat() {
  return (
    <a
      href="https://wa.me/5534992179828?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20pintura%20eletrost%C3%A1tica."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--staticolor-whatsapp)] hover:bg-[var(--staticolor-whatsapp-dark)] text-white px-4 py-3 md:px-5 md:py-3 rounded-full shadow-lg transition-transform hover:scale-105 group"
      aria-label="Fale Conosco pelo WhatsApp"
      style={{ animation: 'pulse-glow 2s infinite' }}
    >
      <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
      <span className="hidden md:block font-bold text-sm">Fale Conosco</span>
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}</style>
    </a>
  );
}

// ─────────────────────────────────────────────
// APP (página completa)
// ─────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip font-sans text-[var(--staticolor-text)] selection:bg-[var(--staticolor-accent)] selection:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 z-[100] rounded text-[var(--staticolor-primary)]">
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="main-content">
        <Hero />
        <About />
        <Benefits />
        <Services />
        <Gallery />
        <Differentials />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <WhatsappFloat />
    </div>
  );
}
