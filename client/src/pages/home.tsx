import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
import { apiRequest } from "@/lib/queryClient";

import heroBackground from "@assets/guy-harris-voice-of-god-on-stage_1772493275715.jpg";
import guyPhoto1 from "@assets/guy-harris-vog-1_1772493713393.jpg";
import guyPhoto2 from "@assets/guy-harris-vog-2_1772493713393.jpg";
import guyPhoto3 from "@assets/guy-harris-vog-3_1772493713393.jpg";
import vogLogo from "@assets/VoiceoverGuy_SPonsor_Banner_1772497822725.png";
import killerBg from "@assets/guy-harris-voiceover-1200_1772529168284.jpg";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Watch", href: "#videos" },
  { label: "Listen", href: "#demos" },
  { label: "Clients", href: "#clients" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const CLIENT_LOGOS: { name: string; file: string }[] = [
  { name: "Butlins", file: "butlins-logo-vog.png" },
  { name: "Mercedes-Benz", file: "mercedes-benz-logo-vog.png" },
  { name: "DPD", file: "dpd-logo-vog.png" },
  { name: "Iceland", file: "iceland-logo-vog.png" },
  { name: "Pfizer", file: "pfizer_logo-vog.png" },
  { name: "Network Rail", file: "network-rail-logo-vog.png" },
  { name: "TV Choice Awards", file: "tv-choice-awards-logo-vog.jpg" },
  { name: "B&M", file: "b-and-m-logo-vog.png" },
  { name: "EON", file: "eon-logo-vog.png" },
  { name: "Purina", file: "purina-Logo-vog.jpg" },
  { name: "CGI", file: "cgi-logo-vog.png" },
  { name: "Amey", file: "amey-vog.png" },
  { name: "WSP Global", file: "wsp-global-logo-vog.png" },
  { name: "Welcome Break", file: "welcome-break-logo-vog.png" },
  { name: "Nexia", file: "nexia-logo-vog.png" },
  { name: "Muslim Aid", file: "muslim-aid-logo-vog.png" },
  { name: "B. Braun", file: "b-braun-vog.png" },
  { name: "Etex", file: "etex-logo-vog.png" },
  { name: "Evotix", file: "evotix-logo-vog.png" },
  { name: "Hayley Group", file: "hayley-group-logo-vog.png" },
  { name: "Bestway Retail", file: "bestway-retail-logo-vog.png" },
  { name: "Go Local", file: "go-local-logo-vog.png" },
  { name: "Bradford Theatres", file: "bradford-theatres-logo-vog.png" },
  { name: "DFC", file: "dfc-logo-vog.png" },
  { name: "Jersey Opera House", file: "jersey-opera-house-Logo-vog.png" },
  { name: "Colab Live", file: "colab-live-logo-vog.jpg" },
  { name: "Awesome Events", file: "awesome-events-Logo-vog.png" },
  { name: "Duke of Edinburgh", file: "d-of-e-Logo-vog.png" },
  { name: "IGA Gaming Awards", file: "iga-gaming-awards-logo-vog.png" },
  { name: "Fragrance Foundation", file: "the-fragrance-foundation-logo-vog.png" },
  { name: "Tenerife Entertainment Awards", file: "teas-awards-logo-vog.jpg" },
  { name: "MAB", file: "mab-Logo-vog.png" },
  { name: "Appreciation Awards", file: "appreciation-awards-logo-vog.png" },
  { name: "Yeadon Town Hall", file: "yeadon-town-hall-logo-vog.png" },
  { name: "EMC", file: "EMC-member-bw.png" },
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
      "Schedule shift? Script tweak? Last minute host change? I can turn updates around fast, without the panic.",
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
                <p className="italic text-gray-500">
                  Guy Harris &mdash;{" "}
                  <a
                    href="https://www.voiceoverguy.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9C060B] hover:underline"
                    data-testid="link-about-main-site"
                  >
                    VoiceoverGuy
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
                        ITV, BBC, Apple, Disney, Samsung, Tesco, Mini, Hotels.com and hundreds more global brands rely on my voice.
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
            Live, pre-recorded or last-minute audio, delivered with calm authority and perfect timing, saved individually for ease of use.
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
      className="relative py-24 md:py-32 overflow-hidden scroll-mt-20"
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
            Watch highlights from some of my biggest Voice of God performances at major events attended by big names and on television across the UK.
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
            Listen to Voice of God demo reels showcasing live event announcements, awards intros, competition spots and arena tours.
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Left column slides in from the left, right column from the right
  // Each item uses a slightly offset scroll window to cascade in one by one
  const x0 = useTransform(scrollYProgress, [0.0, 0.45], [-80, 0]);
  const op0 = useTransform(scrollYProgress, [0.0, 0.45], [0, 1]);

  const x1 = useTransform(scrollYProgress, [0.15, 0.6], [80, 0]);
  const op1 = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  const x2 = useTransform(scrollYProgress, [0.3, 0.75], [-80, 0]);
  const op2 = useTransform(scrollYProgress, [0.3, 0.75], [0, 1]);

  const x3 = useTransform(scrollYProgress, [0.45, 0.9], [80, 0]);
  const op3 = useTransform(scrollYProgress, [0.45, 0.9], [0, 1]);

  const stats = [
    { text: "Over 200,000 scripts voiced.", x: x0, opacity: op0 },
    { text: `${new Date().getFullYear() - 2000}+ years experience.`, x: x1, opacity: op1 },
    { text: "Over 15,000 happy clients.\nVoice heard worldwide.", x: x2, opacity: op2 },
    { text: "Trusted by ITV, BBC, Apple and the UK's biggest live productions.", x: x3, opacity: op3 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden border-b border-white/10"
      style={{ backgroundImage: `url(${killerBg})`, backgroundSize: "cover", backgroundPosition: "center 35%" }}
      data-testid="section-killer-statement"
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {stats.map(({ text, x, opacity }, i) => (
            <motion.p
              key={i}
              className="text-xl md:text-2xl font-bold text-white leading-snug whitespace-pre-line"
              style={{ fontFamily: "'Montserrat', sans-serif", x, opacity }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsSection() {
  return (
    <section
      id="clients"
      className="bg-white pt-24 md:pt-32 pb-20 overflow-hidden"
      data-testid="section-clients"
    >
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <ScrollAnimation className="text-center">
          <p className="text-[#9C060B] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Clients
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Trusted By
          </h2>
          <motion.div
            className="w-16 h-0.5 bg-[#9C060B] mx-auto mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <p className="text-gray-500 max-w-xl mx-auto">
            Brands, broadcasters and live event producers across the UK trust my Voice of God Voice for their biggest moments.
          </p>
        </ScrollAnimation>
      </div>

      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
        data-testid="client-logos-marquee"
      >
        <div className="flex gap-28 w-max animate-marquee" style={{ touchAction: "none" }}>
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex items-center justify-center shrink-0"
              style={{ width: 140 }}
              data-testid={i < CLIENT_LOGOS.length ? `client-${client.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : undefined}
            >
              <img
                src={`/images/clients/${client.file}`}
                alt={client.name}
                className="h-20 w-auto max-w-[200px] object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-500 mt-10 px-6 max-w-3xl mx-auto">
        Event clients include Network Rail, TV Choice, Butlins, Masked Singer, Bestway, Welcome Break, EON, Muslim Aid, Go Local, IGT Gaming, Yeadon Town Hall, Bradford Theatres and more.
      </p>
    </section>
  );
}

function ReviewsBanner() {
  const { data: reviewData } = useQuery<{ rating: number; reviewCount: number }>({
    queryKey: ["/api/reviews"],
    staleTime: 24 * 60 * 60 * 1000,
  });
  const reviewCount = reviewData?.reviewCount ?? 119;
  const rating = reviewData?.rating ?? 5.0;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const leftX = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [-200, 0]);
  const sideOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <section ref={sectionRef} className="relative bg-gray-950 py-16 md:py-24" data-testid="section-reviews">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 flex items-end justify-center gap-3 sm:gap-5 md:gap-6 max-w-full overflow-visible pb-2">
          {/* Left photo — slides in from behind centre */}
          <motion.div
            className="w-28 sm:w-36 md:w-44 flex-shrink-0 group cursor-pointer relative z-0"
            style={{ x: leftX, opacity: sideOpacity }}
          >
            <img
              src={guyPhoto1}
              alt="Guy Harris performing"
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-[#9C060B] transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_20px_rgba(156,6,11,0.5)]"
              data-testid="img-guy-photo-1"
            />
          </motion.div>

          {/* Centre photo — on top, stays in place */}
          <div className="w-32 sm:w-40 md:w-52 flex-shrink-0 -mb-2 group cursor-pointer relative z-10">
            <img
              src={guyPhoto2}
              alt="Guy Harris portrait"
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-[#9C060B] shadow-2xl transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_28px_rgba(156,6,11,0.6)]"
              data-testid="img-guy-photo-2"
            />
          </div>

          {/* Right photo — slides in from behind centre */}
          <motion.div
            className="w-28 sm:w-36 md:w-44 flex-shrink-0 group cursor-pointer relative z-0"
            style={{ x: rightX, opacity: sideOpacity }}
          >
            <img
              src={guyPhoto3}
              alt="Guy Harris with microphone"
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-[#9C060B] transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_0_20px_rgba(156,6,11,0.5)]"
              data-testid="img-guy-photo-3"
            />
          </motion.div>
        </div>

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
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Rated {rating.toFixed(1)} on Google by {reviewCount} Happy Clients
            </h3>
            <a
              href="https://www.google.com/search?q=VoiceoverGuy+Wakefield&ludocid=13238741027900894876#lrd=0x48795b5b8bb4d61d:0xb7a63f64e244a5ec,1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9C060B] font-medium text-sm transition-colors mb-6"
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
    quote: "Guy has worked for us on many occasions as his voice is perfect for so many applications, he is professional and always follows direction. It's always a pleasure to work with him.",
    name: "Phil Peacock",
    title: "Creative Manager, Butlins",
  },
  {
    quote: "Guy Harris has been a regular Voice of God at a number of events for our client Reward Gateway and also features at the annual Benefits Excellence Awards. His efficiency, accuracy and speed never fail to amaze me and I can't recommend his services enough!",
    name: "Phil Miller",
    title: "Managing Director, D.R.",
  },
  {
    quote: "Awesome Events have utilised Guy's supreme service for the last couple of years and we have found his professionalism to be outstanding and his ability to always deliver has assisted us with the planning of hundreds of events and conferences.",
    name: "Denis McCourt",
    title: "Director, Awesome Events",
  },
  {
    quote: "Guy has worked with us on the TV Choice Awards for several years. He consistently delivers high-quality, expressive VO recordings with an impressively fast turnaround. Any amendments are quickly voiced and returned almost immediately, making him a reliable, professional voiceover partner and a supplier we're always happy to recommend.",
    name: "Steve Horne",
    title: "Producer, Stoneapple Productions Ltd",
  },
];

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  return (
    <section className="bg-white pt-8 pb-24 md:pb-32" data-testid="section-testimonials">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            What Clients Say
          </h2>
          <p className="text-gray-500 mb-4">Trusted by agencies, broadcasters, and brands across the UK</p>
          <motion.div className="w-16 h-0.5 bg-[#9C060B] mx-auto" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
        </ScrollAnimation>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 md:p-10"
              data-testid={`testimonial-${TESTIMONIALS[current].name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="text-[#9C060B]/20 text-7xl font-serif leading-none mb-2 select-none">&ldquo;&rdquo;</div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed italic mb-8">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </p>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">{TESTIMONIALS[current].name}</p>
                  <p className="text-sm text-gray-400">{TESTIMONIALS[current].title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#9C060B] hover:text-[#9C060B] transition-colors"
                    data-testid="button-testimonial-prev"
                  >
                    &#8249;
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next testimonial"
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#9C060B] hover:text-[#9C060B] transition-colors"
                    data-testid="button-testimonial-next"
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-[#9C060B] w-4" : "bg-gray-300"
              }`}
              data-testid={`dot-testimonial-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function getGreeting(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 5=Fri … 6=Sat
  const mins = now.getHours() * 60 + now.getMinutes();
  if (day === 5 && mins >= 18 * 60) return "Have a good evening and weekend";
  if (mins < 12 * 60) return "Have a good morning";
  if (mins < 18 * 60) return "Have a good afternoon";
  return "Have a good evening";
}

function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [greeting, setGreeting] = useState("");

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
    setSubmitStatus(null);
    try {
      await apiRequest("POST", "/api/contact", data);
      setGreeting(getGreeting());
      setSubmitStatus("success");
      form.reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gray-950 pt-8 pb-24 md:pb-32"
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
                {(() => {
                  const val = form.watch("message") || "";
                  const wordCount = val.trim() === "" ? 0 : val.trim().split(/\s+/).filter(Boolean).length;
                  const remaining = Math.max(0, 10 - wordCount);
                  if (val.trim() === "") return null;
                  return remaining > 0 ? (
                    <p className="text-xs text-amber-400 mt-1" data-testid="text-word-counter">
                      {remaining} more word{remaining === 1 ? "" : "s"} needed
                    </p>
                  ) : (
                    <p className="text-xs text-green-400 mt-1" data-testid="text-word-counter">
                      ✓ Good to go
                    </p>
                  );
                })()}
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

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-4"
                  data-testid="text-success-message"
                >
                  <p className="text-green-400 font-semibold mb-1">✅ Enquiry sent!</p>
                  <p className="text-gray-300 text-sm">Thanks, I've got it. I'll reply within 24 hours.</p>
                  <p className="text-gray-400 text-sm mt-2 italic">{greeting} 😊</p>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4"
                  data-testid="text-error-message"
                >
                  <p className="text-red-400 font-semibold mb-1">Something went wrong</p>
                  <p className="text-gray-300 text-sm">Please try again or email me directly.</p>
                </motion.div>
              )}
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
          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href="https://www.voiceoverguy.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
              data-testid="link-footer-main-site"
            >
              <img src={vogLogo} alt="VoiceoverGuy - www.voiceoverguy.co.uk" className="h-8 w-auto" />
            </a>
            <div className="flex items-center gap-1 flex-wrap justify-center md:justify-end">
              <span className="text-gray-600 text-xs">Also by Guy:</span>
              <a
                href="https://www.voiceoverguy.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-[#9C060B] transition-colors"
                data-testid="link-footer-voiceoverguy"
              >
                VoiceoverGuy
              </a>
              <span className="text-gray-700 text-xs">&bull;</span>
              <a
                href="https://www.pathevoice.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-[#9C060B] transition-colors"
                data-testid="link-footer-pathe-voice"
              >
                PathéVoice
              </a>
              <span className="text-gray-700 text-xs">&bull;</span>
              <a
                href="https://halloweenvoice.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-[#9C060B] transition-colors"
                data-testid="link-footer-halloween-voice"
              >
                HalloweenVoice
              </a>
              <span className="text-gray-700 text-xs">&bull;</span>
              <a
                href="https://www.santaguy.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-[#9C060B] transition-colors"
                data-testid="link-footer-santa-guy"
              >
                SantaGuy
              </a>
            </div>
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
      <VideosSection />
      <AudioSection />
      <ClientsSection />
      <TestimonialsSection />
      <ServicesSection />
      <KillerStatement />
      <ReviewsBanner />
      <ContactSection />
      <Footer />
    </div>
  );
}