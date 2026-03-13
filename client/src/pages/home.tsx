import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mic,
  Headphones,
  Clock,
  Star,
  Mail,
  Phone,
  Menu,
  X,
  Send,
  ExternalLink,
  Play,
  Award,
  Users,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { AudioPlayer } from "@/components/audio-player";
import audioTakeaway from "@assets/takeaway-on-tour-voice-of-god-demo-guy-harris_1772496115970.mp3";
import audioButlins from "@assets/butlins-voice-of-god-guy-harris_1772496115971.mp3";
import audioMaskedSinger from "@assets/the-masked-singer-voice-of-god-guy-harris_1772496115971.mp3";
import audioBgt from "@assets/bgt-competition-spot-2025-guy-harris_1772496384632.mp3";
import { contactFormSchema, type ContactForm } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import logoAltonTowers from "@assets/voiceoverguy-clients-alton-towers_1772482508721.png";
import logoApple from "@assets/voiceoverguy-clients-apple_1772482508721.png";
import logoAsda from "@assets/voiceoverguy-clients-asda_1772482508721.png";
import logoBarclays from "@assets/voiceoverguy-clients-barclays_1772482508721.png";
import logoBaxi from "@assets/voiceoverguy-clients-baxi_1772482508722.png";
import logoBbc2 from "@assets/voiceoverguy-clients-bbc-2_1772482508722.png";
import logoBbcRadio1 from "@assets/voiceoverguy-clients-bbc-radio-1_1772482508722.png";
import logoBecks from "@assets/voiceoverguy-clients-becks_1772482508722.png";
import logoBetfred from "@assets/voiceoverguy-clients-betfred_1772482538649.png";
import logoBiffa from "@assets/voiceoverguy-clients-biffa_1772482538649.png";
import logoBoomBeach from "@assets/voiceoverguy-clients-boom-beach_1772482538649.png";
import logoBoomRadio from "@assets/voiceoverguy-clients-boom-radio_1772482508719.png";
import logoBupa from "@assets/voiceoverguy-clients-bupa_1772482538649.png";
import logoButlins from "@assets/voiceoverguy-clients-butlins_1772482538649.png";
import logoCapital from "@assets/voiceoverguy-clients-capital_1772482538650.png";
import logoCbeebies from "@assets/voiceoverguy-clients-cbeebies_1772482538650.png";
import logoCentreParcs from "@assets/voiceoverguy-clients-centre-parcs_1772482538650.png";
import logoCocaCola from "@assets/voiceoverguy-clients-coca-cola_1772482538650.png";
import logoDpd from "@assets/voiceoverguy-clients-dpd_1772482538651.png";
import logoDreamworks from "@assets/voiceoverguy-clients-dreamworks_1772482538651.png";
import logoEmirates from "@assets/voiceoverguy-clients-emirates_1772482538651.png";
import logoHeart from "@assets/voiceoverguy-clients-heart_1772482538652.png";
import logoHotels from "@assets/voiceoverguy-clients-hotels-brand_1772482538652.png";
import logoItv from "@assets/voiceoverguy-clients-itv_1772482538652.png";
import logoJustEat from "@assets/voiceoverguy-clients-just-eat_1772482508720.png";
import logoKelloggs from "@assets/voiceoverguy-clients-kelloggs_1772482538652.png";
import logoMcDonalds from "@assets/voiceoverguy-clients-mcd_1772482538653.png";
import logoBooking from "@assets/voiceoverguy-booking-dot-com-brand_1772482508721.png";
import heroBackground from "@assets/guy-harris-voice-of-god-on-stage_1772493275715.jpg";
import guyPhoto1 from "@assets/guy-harris-vog-1_1772493713393.jpg";
import guyPhoto2 from "@assets/guy-harris-vog-2_1772493713393.jpg";
import guyPhoto3 from "@assets/guy-harris-vog-3_1772493713393.jpg";
import vogLogo from "@assets/VoiceoverGuy_SPonsor_Banner_1772497822725.png";
import killerBg from "@assets/guy-harris-voiceover-1200_1772529168284.jpg";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Watch", href: "#videos" },
  { label: "Listen", href: "#demos" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

const CLIENTS: { name: string; logo: string }[] = [
  { name: "ITV", logo: logoItv },
  { name: "BBC Two", logo: logoBbc2 },
  { name: "BBC Radio 1", logo: logoBbcRadio1 },
  { name: "CBeebies", logo: logoCbeebies },
  { name: "Apple", logo: logoApple },
  { name: "Coca-Cola", logo: logoCocaCola },
  { name: "McDonald's", logo: logoMcDonalds },
  { name: "Hotels.com", logo: logoHotels },
  { name: "Booking.com", logo: logoBooking },
  { name: "Barclays", logo: logoBarclays },
  { name: "Emirates", logo: logoEmirates },
  { name: "DreamWorks", logo: logoDreamworks },
  { name: "Kellogg's", logo: logoKelloggs },
  { name: "Just Eat", logo: logoJustEat },
  { name: "Asda", logo: logoAsda },
  { name: "DPD", logo: logoDpd },
  { name: "Heart Radio", logo: logoHeart },
  { name: "Capital FM", logo: logoCapital },
  { name: "Boom Radio", logo: logoBoomRadio },
  { name: "Centre Parcs", logo: logoCentreParcs },
  { name: "Alton Towers", logo: logoAltonTowers },
  { name: "Butlins", logo: logoButlins },
  { name: "Bupa", logo: logoBupa },
  { name: "Betfred", logo: logoBetfred },
  { name: "Beck's", logo: logoBecks },
  { name: "Biffa", logo: logoBiffa },
  { name: "Baxi", logo: logoBaxi },
  { name: "Boom Beach", logo: logoBoomBeach },
];

const SERVICES = [
  {
    icon: Mic,
    title: "Live Voice of God",
    description:
      "Commanding live announcing for awards, arena tours and major events, delivered with presence, timing and control.",
  },
  {
    icon: Headphones,
    title: "Pre-Recorded Intros",
    description:
      "Cinematic, broadcast-quality announcements supplied in advance, ready for playback with perfect pacing.",
  },
  {
    icon: Clock,
    title: "Last-Minute Changes",
    description:
      "Schedule shift? Script tweak? I can turn updates around fast, without the panic.",
  },
];

const STATS = [
  { value: `${new Date().getFullYear() - 2000}+`, label: "Years Experience", icon: Award },
  { value: "200k+", label: "Scripts Voiced", icon: FileText },
  { value: "5.0", label: "Google Rating", icon: Star },
  { value: "15k+", label: "Happy Clients", icon: Users },
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`font-bold text-lg tracking-tight transition-colors cursor-pointer ${
            scrolled ? "text-gray-900" : "text-white"
          }`}
          data-testid="link-home"
        >
          <span className="font-medium">VOICEOVER</span>
          <span className="text-[#9C060B]">GUY</span>
          <span className="font-normal text-sm ml-1.5 hidden sm:inline opacity-60">- Voice of God</span>
        </button>

        <div className="hidden md:flex items-center gap-1 flex-wrap">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? scrolled
                      ? "text-gray-900"
                      : "text-white"
                    : scrolled
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-white/80 hover:text-white"
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#9C060B] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!isActive && hoveredLink === link.href && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#9C060B]/60 rounded-full"
                    transition={{ duration: 0.2 }}
                    style={{ originX: 0.5 }}
                  />
                )}
              </button>
            );
          })}
          <Button
            size="sm"
            className="ml-2 bg-[#9C060B] hover:bg-[#7E0408] text-white border-[#9C060B]"
            onClick={() => handleNavClick("#contact")}
            data-testid="button-nav-contact"
          >
            Get in Touch
          </Button>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className={`md:hidden ${
            scrolled ? "text-gray-900" : "text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="justify-start text-gray-700"
                  onClick={() => handleNavClick(link.href)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                className="mt-2 bg-[#9C060B] hover:bg-[#7E0408] text-white border-[#9C060B]"
                onClick={() => handleNavClick("#contact")}
                data-testid="button-mobile-contact"
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    if (showVideo) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showVideo]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
      data-testid="section-hero"
    >
      <img
        src={heroBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gray-950/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-transparent to-gray-950/90" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9C060B]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9C060B]/30 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#9C060B] text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.3em] uppercase mb-6"
        >
          Guy Harris
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          role="heading"
          aria-level={2}
        >
          VOICE OF{" "}
          <span className="text-[#9C060B]">GOD</span>
        </motion.div>
        <h1 className="sr-only">Voice of God UK – Live Event Announcer & Awards Voiceover</h1>
        <p className="sr-only">Voice of God announcer UK – live event voiceover announcer for award ceremonies, arena tours and corporate events.</p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          When the lights dim and the room falls silent…
          <br />
          this is the voice they hear.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <Button
            size="lg"
            className="bg-[#9C060B] hover:bg-[#7E0408] text-white border-[#9C060B] text-base px-8"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-testid="button-hero-contact"
          >
            Book for Your Event
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white bg-white/5 backdrop-blur-sm text-base px-8"
            onClick={() =>
              document
                .querySelector("#demos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-testid="button-hero-demos"
          >
            <Play className="h-4 w-4 mr-2" />
            Listen to Demos
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-sm text-gray-400 italic tracking-wide mb-12"
        >
          Live event announcing for award ceremonies, arena tours, corporate shows and major productions across the UK.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <button
            onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative group flex items-center justify-center w-24 h-24 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all duration-300 hover:border-[#9C060B] hover:bg-[#9C060B]/20 hover:shadow-[0_0_35px_rgba(255,255,255,0.35)]"
            data-testid="button-hero-play-video"
            aria-label="Watch showreel video"
          >
            <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
            <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
          </button>
          <span className="text-xs text-gray-400 tracking-wider uppercase">Watch Showreel</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-sm text-gray-500"
        >
          Trusted by ITV, BBC, Butlins, The Masked Singer & more
        </motion.p>
      </div>


      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setShowVideo(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            data-testid="modal-hero-video"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
                data-testid="button-close-hero-video"
                aria-label="Close video"
              >
                <X className="h-8 w-8" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/4Le6P6sk7cs?autoplay=1&mute=1&vq=hd1080&modestbranding=1&rel=0&showinfo=0"
                title="Voice of God Demo | Guy Harris"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="relative bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <stat.icon className="h-5 w-5 text-[#9C060B] mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

const RECENT_EVENTS = [
  "Ant & Dec's Saturday Night Takeaway Tour",
  "The Masked Singer",
  "GB News",
  "B&M Awards",
  "DPD Awards",
  "Duke of Edinburgh Awards",
  "East Midlands Chamber Business Awards",
  "NISA",
  "Bestway",
  "Butlins",
  "IGA Awards",
  "Purina Awards",
  "EON Awards",
  "Awesome Events Christmas Shows",
  "CGI Jersey",
  "I&C Connect",
  "Welcome Break Awards",
  "Iceland Supplier Awards",
  "TEAS Awards Tenerife",
  "Staracts",
];

function EventsTicker() {
  return (
    <section className="bg-gray-950 py-4 overflow-hidden" data-testid="section-events-ticker">
      <div className="max-w-6xl mx-auto px-6 mb-2">
        <p className="text-[#9C060B] text-xs font-semibold tracking-[0.2em] uppercase text-center">
          THE VOICE BEHIND
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        <div
          className="flex whitespace-nowrap ticker-animate"
        >
          {[...RECENT_EVENTS, ...RECENT_EVENTS].map((event, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span
                className="text-white/90 text-sm font-bold uppercase tracking-wider px-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {event}
              </span>
              <span className="text-[#9C060B] text-lg">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-white py-24 md:py-32" data-testid="section-about">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollAnimation variant="fadeLeft">
            <div>
              <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                About
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                What is Voice of God?
              </h2>
              <motion.div className="w-16 h-0.5 bg-[#9C060B] mb-6" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ originX: 0 }} />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg font-medium text-gray-900 italic">
                  The moment before the applause.
                </p>
                <p>
                  When 2,000 guests are seated.
                  <br />
                  When the finalists are waiting backstage.
                  <br />
                  When the lights fall to black.
                </p>
                <p className="font-medium text-gray-900">
                  That's when the voice matters.
                </p>
                <p>
                  From arena tours to black-tie award ceremonies, I deliver perfectly
                  timed, broadcast-quality announcements that set the tone for the
                  entire night.
                </p>
                <p className="font-medium text-gray-900 italic">
                  I make your awards feel like the BAFTAs.
                </p>
                <p>
                  Voice of God is part of{" "}
                  <a
                    href="https://www.voiceoverguy.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9C060B] font-medium hover:underline"
                    data-testid="link-about-main-site"
                  >
                    VoiceoverGuy.co.uk
                  </a>
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation variant="fadeRight" delay={0.2}>
            <div className="relative">
              <div className="bg-gray-50 rounded-md p-8 md:p-10">
                <h3
                  className="text-xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Why Clients Choose Me
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-md bg-[#9C060B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-4 w-4 text-[#9C060B]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Reliability & Speed
                      </h4>
                      <p className="text-sm text-gray-500">
                        Same-day turnaround, broadcast-quality audio, and {new Date().getFullYear() - 2000}+ years of
                        experience means your project moves without fuss.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-md bg-[#9C060B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="h-4 w-4 text-[#9C060B]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Award-Winning
                      </h4>
                      <p className="text-sm text-gray-500">
                        VOX Best Male Voiceover Award winner and 3-time SOVAS (USA)
                        finalist. Quality you can trust.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-md bg-[#9C060B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="h-4 w-4 text-[#9C060B]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Trusted by the Best
                      </h4>
                      <p className="text-sm text-gray-500">
                        ITV, BBC, Apple, Disney, Samsung, and hundreds more global
                        brands rely on my voice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#9C060B]/20 rounded-tl-md pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-[#9C060B]/20 rounded-br-md pointer-events-none" />
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-gray-50 py-24 md:py-32"
      data-testid="section-services"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Services
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            How It Works On The Night
          </h2>
          <motion.div className="w-16 h-0.5 bg-[#9C060B] mx-auto mb-4" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
          <p className="text-gray-500 max-w-xl mx-auto">
            Live, pre-recorded or last-minute, delivered with calm authority and perfect timing.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service) => (
            <StaggerItem key={service.title}>
              <div
                className="bg-white rounded-md p-8 h-full transition-all duration-300 border border-gray-100"
                data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="h-12 w-12 rounded-md bg-[#9C060B]/10 flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-[#9C060B]" />
                </div>
                <h3
                  className="text-xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

const VIDEO_CARDS = [
  {
    id: "masked-singer",
    embedId: "e0vZ9cxdilo",
    thumbnail: "/images/masked-singer-voice-of-god.webp",
    alt: "Voice of God show announcer for The Masked Singer",
    title: "The Masked Singer",
    description: "Voice of God show announcer at Butlins",
    testId: "video-masked-singer",
  },
  {
    id: "ant-and-dec",
    embedId: "W99pMUr6G8Q",
    thumbnail: "/images/takeaway-on-tour-voice-of-god.webp",
    alt: "Voice of God announcer for Ant and Dec's Saturday Night Takeaway tour",
    title: "Ant & Dec's Saturday Night Takeaway",
    description: "Voice of God announcer for the live arena tour",
    testId: "video-ant-and-dec",
  },
  {
    id: "bgt",
    embedId: "4yTnVRDXZfQ",
    thumbnail: "/images/britains-got-talent-competition-voiceover.webp",
    alt: "Competition voiceover for Britain's Got Talent",
    title: "Britain's Got Talent Competition Voiceover",
    description: "Voice of the comp spots in 2025",
    testId: "video-vog-demo",
  },
  {
    id: "tv-choice-awards",
    embedId: "4Le6P6sk7cs",
    thumbnail: "/images/guy-tv-choice-awards-voice-of-god.jpg",
    alt: "Guy Harris Voice of God at the TV Choice Awards",
    title: "TV Choice Awards Voice of God",
    description: "Heard every year in a room full of celebrities in a posh hotel in London!",
    testId: "video-showreel",
  },
];

function VideoCard({ video }: { video: typeof VIDEO_CARDS[number] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div data-testid={video.testId} className="group rounded-2xl bg-gray-50 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1&vq=hd1080&modestbranding=1&rel=0&showinfo=0`}
            title={`${video.title} | Guy Harris`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C060B] focus-visible:ring-offset-2"
            aria-label={`Play ${video.title}`}
            data-testid={`play-button-${video.id}`}
          >
            <img
              src={video.thumbnail}
              alt={video.alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="w-[68px] h-[48px] transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-lg"
                viewBox="0 0 68 48"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000" />
                <path d="M45 24L27 14v20" fill="#fff" />
              </svg>
            </div>
            <img
              src="/images/youtube-logo.png"
              alt=""
              aria-hidden="true"
              className="absolute bottom-2 left-2 w-[60px] opacity-70 pointer-events-none drop-shadow-md"
            />
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
          {video.title}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          {video.description}
        </p>
      </div>
    </div>
  );
}

function VideoGrid() {
  return (
    <StaggerContainer className="grid md:grid-cols-2 gap-8" staggerDelay={0.12}>
      {VIDEO_CARDS.map((video) => (
        <StaggerItem key={video.id}>
          <VideoCard video={video} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

function VideosSection() {
  return (
    <section
      id="videos"
      className="relative py-24 md:py-32 overflow-hidden"
      data-testid="section-videos"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/voice-of-god-youtube-bg.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/[0.93]" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Watch
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See It In Action
          </h2>
          <motion.div className="w-16 h-0.5 bg-[#9C060B] mx-auto mb-4" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
          <p className="text-gray-500 max-w-xl mx-auto">
            Watch highlights from some of my biggest Voice of God performances
            at major events across the UK.
          </p>
        </ScrollAnimation>

        <VideoGrid />
      </div>
    </section>
  );
}

function AudioSection() {
  return (
    <section
      id="demos"
      className="bg-gray-50 py-24 md:py-32"
      data-testid="section-demos"
    >
      <div className="max-w-5xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-12">
          <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Listen
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Audio Demos
          </h2>
          <motion.div className="w-16 h-0.5 bg-[#9C060B] mx-auto mb-4" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
          <p className="text-gray-500 max-w-xl mx-auto">
            Listen to Voice of God demo reels showcasing live event announcements,
            awards intros and arena tours.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
          <StaggerItem>
            <AudioPlayer
              title="Ant & Dec's Takeaway on Tour"
              subtitle="Voice of God Demo"
              src={audioTakeaway}
            />
          </StaggerItem>
          <StaggerItem>
            <AudioPlayer
              title="Butlins Resorts"
              subtitle="Voice of God"
              src={audioButlins}
            />
          </StaggerItem>
          <StaggerItem>
            <AudioPlayer
              title="The Masked Singer"
              subtitle="Voice of God"
              src={audioMaskedSinger}
            />
          </StaggerItem>
          <StaggerItem>
            <AudioPlayer
              title="Britain's Got Talent"
              subtitle="Competition Spot 2025"
              src={audioBgt}
            />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

function KillerStatement() {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden border-b border-white/10"
      style={{ backgroundImage: `url(${killerBg})`, backgroundSize: "cover", backgroundPosition: "center 35%" }}
      data-testid="section-killer-statement"
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <p
              className="text-xl md:text-2xl font-bold text-white leading-snug"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Over 200,000 scripts voiced.
            </p>
            <p
              className="text-xl md:text-2xl font-bold text-white leading-snug"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {`${new Date().getFullYear() - 2000}+ years experience.`}
            </p>
            <p
              className="text-xl md:text-2xl font-bold text-white leading-snug"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Over 15,000 happy clients.
            </p>
            <p
              className="text-xl md:text-2xl font-bold text-white leading-snug"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Trusted by ITV, BBC, Apple and the UK's biggest live productions.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

function ClientsSection() {
  return (
    <section
      id="clients"
      className="bg-gray-950 py-28 md:py-36"
      data-testid="section-clients"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Clients
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Trusted By
          </h2>
          <motion.div className="w-16 h-0.5 bg-[#9C060B] mx-auto mb-4" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
          <p className="text-gray-400 max-w-xl mx-auto">
            Brands and broadcasters across the UK and worldwide trust my voice
            for their biggest moments.
          </p>
        </ScrollAnimation>

        <StaggerContainer
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4"
          staggerDelay={0.03}
        >
          {CLIENTS.map((client) => (
            <StaggerItem key={client.name}>
              <div
                className="group relative flex flex-col items-center justify-center h-24 rounded-lg bg-white/5 border border-white/10 p-3 transition-all duration-500 cursor-default"
                data-testid={`client-${client.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-12 max-w-full object-contain transition-all duration-300 group-hover:-translate-y-1 opacity-90 hover:opacity-100"
                  loading="lazy"
                  data-testid={`logo-${client.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                />
                <span
                  className="absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-semibold text-gray-400 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  data-testid={`name-${client.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                >
                  {client.name}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ReviewsBanner() {
  return (
    <section className="bg-gray-950 py-16 md:py-24" data-testid="section-reviews">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollAnimation className="mb-12">
          <div className="flex items-end justify-center gap-3 sm:gap-5 md:gap-6 max-w-full overflow-hidden">
            <div className="w-28 sm:w-36 md:w-44 flex-shrink-0">
              <img
                src={guyPhoto1}
                alt="Guy Harris performing"
                className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-white/10"
                data-testid="img-guy-photo-1"
              />
            </div>
            <div className="w-32 sm:w-40 md:w-52 flex-shrink-0 -mb-2">
              <img
                src={guyPhoto2}
                alt="Guy Harris portrait"
                className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-white/20 shadow-2xl"
                data-testid="img-guy-photo-2"
              />
            </div>
            <div className="w-28 sm:w-36 md:w-44 flex-shrink-0">
              <img
                src={guyPhoto3}
                alt="Guy Harris with microphone"
                className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-white/10"
                data-testid="img-guy-photo-3"
              />
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation variant="scale">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 text-yellow-400"
                  fill="currentColor"
                />
              ))}
            </div>
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Rated 5.0 on Google by 118 Happy Clients
            </h3>
            <p className="text-gray-400 mb-6">
              Event clients include ITV, TV Choice, Butlins, Masked Singer,
              Bestway, Poundland, EON, National History Museum, IGT Gaming and
              more.
            </p>
            <a
              href="https://www.google.com/search?q=VoiceoverGuy+Wakefield&ludocid=13238741027900894876#lrd=0x48795b5b8bb4d61d:0xb7a63f64e244a5ec,1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9C060B] font-medium text-sm transition-colors"
              data-testid="link-google-reviews"
            >
              Read Google Reviews
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote: "Guy has worked for us on many occasions as his voice is perfect for so many applications, he is professional and always follows direction. It\u2019s always a pleasure to work with him.",
    name: "Phil Peacock",
    title: "Creative Manager, Butlins",
  },
  {
    quote: "Guy Harris has been a regular Voice of God at a number of events for our client Reward Gateway and also features at the annual Benefits Excellence Awards. His efficiency, accuracy and speed never fail to amaze me and I can\u2019t recommend his services enough!",
    name: "Phil Miller",
    title: "Managing Director, D.R.",
  },
  {
    quote: "Awesome Events have utilised Guy\u2019s supreme service for the last couple of years and we have found his professionalism to be outstanding and his ability to always deliver has assisted us with the planning of hundreds of events and conferences.",
    name: "Denis McCourt",
    title: "Director, Awesome Events",
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-white py-24 md:py-32" data-testid="section-testimonials">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Testimonials
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            What Clients Say
          </h2>
          <motion.div className="w-16 h-0.5 bg-[#9C060B] mx-auto" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
        </ScrollAnimation>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.1}>
          {TESTIMONIALS.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div
                className="relative bg-gray-50 border border-gray-100 rounded-xl p-6 lg:p-8 h-full flex flex-col"
                data-testid={`testimonial-${testimonial.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="text-[#9C060B]/30 text-5xl font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      toast({
        title: "Enquiry sent ✅",
        description:
          "Thanks, I've got it. I'll reply within 24 hours.",
        duration: 3500,
      });
      form.reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gray-950 py-24 md:py-32"
      data-testid="section-contact"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <ScrollAnimation variant="fadeLeft">
            <div>
              <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Contact
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Let's Make Your Event Unforgettable
              </h2>
              <motion.div className="w-16 h-0.5 bg-[#9C060B] mb-6" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ originX: 0 }} />
              <p className="text-gray-400 leading-relaxed mb-6">
                Whether you need a bold live announcer or a perfectly timed
                pre-recorded voice, I'm in the studio and ready to help.
                Get in touch today and let me know what needs voicing.
              </p>
              <p className="text-gray-500 text-sm" data-testid="text-reassurance">
                Send a message using the form and I'll get back to you within 24 hours (Mon–Fri).
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation variant="fadeRight" delay={0.15}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              data-testid="form-contact"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300 text-sm mb-1.5 block">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    {...form.register("name")}
                    data-testid="input-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-400 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300 text-sm mb-1.5 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    {...form.register("email")}
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-400 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-gray-300 text-sm mb-1.5 block">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Your phone number"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    {...form.register("phone")}
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="eventType"
                    className="text-gray-300 text-sm mb-1.5 block"
                  >
                    Event Type
                  </Label>
                  <Input
                    id="eventType"
                    placeholder="Awards, Conference, etc."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    {...form.register("eventType")}
                    data-testid="input-event-type"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-300 text-sm mb-1.5 block">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your event or project..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 min-h-[120px] resize-none"
                  {...form.register("message")}
                  data-testid="input-message"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-red-400 mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              <p className="text-gray-500 text-sm mt-2 mb-3" data-testid="text-above-submit">
                Your enquiry goes directly to Guy, no call centres, no middlemen.
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#9C060B] hover:bg-[#7E0408] text-white border-[#9C060B]"
                disabled={isSubmitting}
                data-testid="button-submit-contact"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Enquiry
                  </>
                )}
              </Button>
              <p className="text-gray-500 text-sm mt-3" data-testid="text-below-submit">
                Every enquiry is read personally by Guy, you'll hear back within 24 hours.
              </p>
            </form>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="bg-gray-950 border-t border-white/5 py-8"
      data-testid="footer"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">
              <span className="font-light">VOICEOVER</span>
              <span className="text-[#9C060B]">GUY</span>
            </span>
            <span className="text-gray-600 text-sm">
              &copy; 2000 &ndash; {new Date().getFullYear()} Guy Harris. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <a
              href="https://www.voiceoverguy.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
              data-testid="link-footer-main-site"
            >
              <img src={vogLogo} alt="VoiceoverGuy - www.voiceoverguy.co.uk" className="h-8 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <EventsTicker />
      <AboutSection />
      <ServicesSection />
      <VideosSection />
      <AudioSection />
      <KillerStatement />
      <ClientsSection />
      <ReviewsBanner />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}