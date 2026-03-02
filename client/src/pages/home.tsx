import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mic,
  Headphones,
  Clock,
  ChevronDown,
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
import { contactFormSchema, type ContactForm } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Watch", href: "#videos" },
  { label: "Listen", href: "#demos" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

const CLIENTS = [
  "ITV",
  "BBC",
  "Butlins",
  "The Masked Singer",
  "Britain's Got Talent",
  "BBC Radio 1",
  "BBC Radio 2",
  "National History Museum",
  "TV Choice",
  "Ant & Dec",
  "Ninja Warrior UK",
  "Poundland",
  "Bestway",
  "Apple",
  "Disney",
  "Samsung",
  "Tesco",
  "Asda",
  "Coca-Cola",
  "McDonald's",
  "Hotels.com",
  "Thomas & Friends",
  "Heart Radio",
  "Capital FM",
  "CBeebies",
  "GB News",
  "Centre Parcs",
  "Alton Towers",
  "DPD",
  "Just Eat",
];

const SERVICES = [
  {
    icon: Mic,
    title: "Live Voice of God",
    description:
      "Commanding live announcements at your event. From arena tours to award ceremonies, I deliver powerful, perfectly-timed intros that lift the entire atmosphere.",
  },
  {
    icon: Headphones,
    title: "Pre-Recorded",
    description:
      "Broadcast-quality pre-recorded announcements delivered from my professional studio. Same-day turnaround available with seamless integration into your event.",
  },
  {
    icon: Clock,
    title: "Last Minute",
    description:
      "Don't panic. Technology allows for last-minute changes, same-day audio delivery and seamless integration. I've got it covered, even at short notice.",
  },
];

const STATS = [
  { value: "25+", label: "Years Experience", icon: Award },
  { value: "200k+", label: "Scripts Voiced", icon: FileText },
  { value: "5.0", label: "Google Rating", icon: Star },
  { value: "118", label: "Happy Clients", icon: Users },
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`font-bold text-lg tracking-tight transition-colors ${
            scrolled ? "text-gray-900" : "text-white"
          }`}
          data-testid="link-home"
        >
          <span className="font-light">VOICEOVER</span>
          <span className="text-[#CC0000]">GUY</span>
        </a>

        <div className="hidden md:flex items-center gap-1 flex-wrap">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/80 hover:text-white"
              }`}
              data-testid={`link-${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          ))}
          <Button
            size="sm"
            className="ml-2 bg-[#CC0000] text-white border-[#CC0000]"
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
                className="mt-2 bg-[#CC0000] text-white border-[#CC0000]"
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
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(204,0,0,0.08)_0%,_transparent_70%)]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC0000]/30 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#CC0000] text-sm font-semibold tracking-[0.3em] uppercase mb-6"
        >
          Guy Harris
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          VOICE OF{" "}
          <span className="text-[#CC0000]">GOD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          The powerful, unmistakable voice that guides audiences through
          major events, awards ceremonies and arena tours across the UK and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            className="bg-[#CC0000] text-white border-[#CC0000] text-base px-8"
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
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-sm text-gray-500"
        >
          Trusted by ITV, BBC, Butlins, The Masked Singer & more
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-gray-500" />
        </motion.div>
      </motion.div>
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
                <stat.icon className="h-5 w-5 text-[#CC0000] mx-auto mb-2" />
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

function AboutSection() {
  return (
    <section id="about" className="bg-white py-24 md:py-32" data-testid="section-about">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollAnimation variant="fadeLeft">
            <div>
              <p className="text-[#CC0000] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                About
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                What is Voice of God?
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Voice of God is the powerful, unmistakable live or pre-recorded
                  voice that guides audiences through major events, theatre shows,
                  awards ceremonies and arena tours.
                </p>
                <p>
                  I'm the voice behind:{" "}
                  <span className="text-gray-900 font-medium italic">
                    "Ladies and Gentlemen, please take your seats..."
                  </span>{" "}
                  and dozens of other iconic announcements heard across the UK and
                  beyond.
                </p>
                <p>
                  From huge arena productions to corporate keynotes, brands trust me
                  to deliver impactful, perfectly timed announcements that lift the
                  entire event. When{" "}
                  <span className="font-medium text-gray-900">The Masked Singer</span>{" "}
                  arrived at Butlins, they needed the full Voice of God treatment. When{" "}
                  <span className="font-medium text-gray-900">Britain's Got Talent</span>{" "}
                  needed a competition voice, they called me.
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
                    <div className="h-8 w-8 rounded-md bg-[#CC0000]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-4 w-4 text-[#CC0000]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Reliability & Speed
                      </h4>
                      <p className="text-sm text-gray-500">
                        Same-day turnaround, broadcast-quality audio, and 25+ years of
                        experience means your project moves without fuss.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-md bg-[#CC0000]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="h-4 w-4 text-[#CC0000]" />
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
                    <div className="h-8 w-8 rounded-md bg-[#CC0000]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="h-4 w-4 text-[#CC0000]" />
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
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-[#CC0000]/20 rounded-tl-md pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-[#CC0000]/20 rounded-br-md pointer-events-none" />
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
          <p className="text-[#CC0000] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Services
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            How I Work
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you need a commanding live presence or a polished pre-recorded
            announcer, I deliver on time, every time.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service) => (
            <StaggerItem key={service.title}>
              <div
                className="bg-white rounded-md p-8 h-full transition-all duration-300 border border-gray-100"
                data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="h-12 w-12 rounded-md bg-[#CC0000]/10 flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-[#CC0000]" />
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

function VideosSection() {
  return (
    <section
      id="videos"
      className="bg-white py-24 md:py-32"
      data-testid="section-videos"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[#CC0000] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Watch
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See It In Action
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Watch highlights from some of my biggest Voice of God performances
            at major events across the UK.
          </p>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8">
          <ScrollAnimation variant="fadeLeft" delay={0}>
            <div data-testid="video-masked-singer">
              <div className="relative aspect-video rounded-md overflow-hidden bg-gray-900 shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/e0vZ9cxdilo"
                  title="The Masked Singer – Voice of God Show Announcer | Guy Harris"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                The Masked Singer
              </h3>
              <p className="text-sm text-gray-500">
                Voice of God show announcer at Butlins
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation variant="fadeRight" delay={0.15}>
            <div data-testid="video-ant-and-dec">
              <div className="relative aspect-video rounded-md overflow-hidden bg-gray-900 shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/W99pMUr6G8Q"
                  title="Ant & Dec's Saturday Night Takeaway Tour – Voice of God Announcer | Guy Harris"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Ant & Dec's Saturday Night Takeaway
              </h3>
              <p className="text-sm text-gray-500">
                Voice of God announcer for the live arena tour
              </p>
            </div>
          </ScrollAnimation>
        </div>
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
      <div className="max-w-3xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-12">
          <p className="text-[#CC0000] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Listen
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Audio Demos
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Listen to Voice of God demo reels showcasing live event announcements,
            awards intros and arena tours.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="space-y-4" staggerDelay={0.15}>
          <StaggerItem>
            <AudioPlayer
              title="Voice of God Showreel"
              subtitle="Live event announcements & arena tours"
            />
          </StaggerItem>
          <StaggerItem>
            <AudioPlayer
              title="Awards Ceremony Demo"
              subtitle="Corporate awards & gala announcements"
            />
          </StaggerItem>
          <StaggerItem>
            <AudioPlayer
              title="Arena & Stage Demo"
              subtitle="Large-scale live productions & tours"
            />
          </StaggerItem>
        </StaggerContainer>

        <ScrollAnimation delay={0.4} className="text-center mt-8">
          <p className="text-sm text-gray-400">
            MP3 demos loading soon. Contact me directly for samples.
          </p>
        </ScrollAnimation>
      </div>
    </section>
  );
}

function ClientsSection() {
  return (
    <section
      id="clients"
      className="bg-white py-24 md:py-32"
      data-testid="section-clients"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="text-[#CC0000] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Clients
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Trusted By
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Brands and broadcasters across the UK and worldwide trust my voice
            for their biggest moments.
          </p>
        </ScrollAnimation>

        <StaggerContainer
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4"
          staggerDelay={0.04}
        >
          {CLIENTS.map((client) => (
            <StaggerItem key={client}>
              <div
                className="flex items-center justify-center h-16 rounded-md bg-gray-50 border border-gray-100 px-4"
                data-testid={`client-${client.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              >
                <span className="text-xs sm:text-sm font-semibold text-gray-400 text-center leading-tight">
                  {client}
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
    <section className="bg-gray-950 py-16" data-testid="section-reviews">
      <div className="max-w-4xl mx-auto px-6">
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
              Rated 5.0 by 118 Happy Clients
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
              className="inline-flex items-center gap-2 text-[#CC0000] font-medium text-sm transition-colors"
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
        title: "Message sent",
        description:
          "Thanks for getting in touch. I'll get back to you shortly.",
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
              <p className="text-[#CC0000] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Contact
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Let's Make Your Event Unforgettable
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Whether you need a bold live announcer or a perfectly timed
                pre-recorded voice, I'm in the studio and ready to help.
                Get in touch today and let me know what needs voicing.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:guy@voiceoverguy.co.uk?subject=Website%20enquiry"
                  className="flex items-center gap-3 text-gray-300 transition-colors group"
                  data-testid="link-email"
                >
                  <div className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#CC0000]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium group-hover:text-white transition-colors">
                      guy@voiceoverguy.co.uk
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+447973350178"
                  className="flex items-center gap-3 text-gray-300 transition-colors group"
                  data-testid="link-phone"
                >
                  <div className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#CC0000]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium group-hover:text-white transition-colors">
                      +44 (0)7973 350 178
                    </p>
                  </div>
                </a>
              </div>
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

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#CC0000] text-white border-[#CC0000]"
                disabled={isSubmitting}
                data-testid="button-submit-contact"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
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
              <span className="text-[#CC0000]">GUY</span>
            </span>
            <span className="text-gray-600 text-sm">
              &copy; 2000 &ndash; {new Date().getFullYear()} Guy Harris. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <a
              href="mailto:guy@voiceoverguy.co.uk"
              className="text-sm text-gray-500"
              data-testid="link-footer-email"
            >
              guy@voiceoverguy.co.uk
            </a>
            <a
              href="tel:+447973350178"
              className="text-sm text-gray-500"
              data-testid="link-footer-phone"
            >
              +44 7973 350 178
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ServicesSection />
      <VideosSection />
      <AudioSection />
      <ClientsSection />
      <ReviewsBanner />
      <ContactSection />
      <Footer />
    </div>
  );
}